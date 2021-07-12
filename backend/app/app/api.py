from functools import lru_cache

import tweepy
from celery.result import AsyncResult
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Body
from starlette.responses import JSONResponse

from . import config, worker

app = FastAPI()


@lru_cache()
def get_settings():
    return config.Settings()


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def get_tweepy_api(settings: config.Settings) -> tweepy.API:
    auth = tweepy.OAuthHandler(
        settings.twitter_consumer_key,
        settings.twitter_consumer_secret
    )
    auth.set_access_token(
        settings.twitter_access_token,
        settings.twitter_access_token_secret
    )

    api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())

    return api


@app.get("/tweets/{ids}")
async def get_tweet_by_ids(
    ids: str,
    settings: config.Settings = Depends(get_settings)
) -> JSONResponse:
    api = get_tweepy_api(settings)
    results = api.statuses_lookup([id for id in ids.split(",")])

    return JSONResponse(results)


@app.get("/tweets/")
async def get_tweets(
    q: str,
    result_type: str = "popular",
    lang: str = "en",
    limit: int = 10,
    settings: config.Settings = Depends(get_settings)
) -> JSONResponse:
    api = get_tweepy_api(settings)
    results = api.search(q=q, count=limit, result_type=result_type, lang=lang)

    return JSONResponse(results)


@app.post("/task", status_code=201)
async def run_task(
    payload=Body(...)
) -> JSONResponse:
    tweet_id = payload["id"]
    task = worker.create_task.delay(tweet_id)

    return JSONResponse({"task_id": task.id})


@app.get("/task/{task_id}")
def get_status(task_id) -> JSONResponse:
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }

    return JSONResponse(result)
