from functools import lru_cache
from typing import Dict

import tweepy
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import config

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
) -> Dict:
    api = get_tweepy_api(settings)
    results = api.statuses_lookup([id for id in ids.split(",")])

    return results


@app.get("/tweets/")
async def get_tweets(
    q: str,
    result_type: str = "popular",
    lang: str = "en",
    limit: int = 10,
    settings: config.Settings = Depends(get_settings)
) -> Dict:
    api = get_tweepy_api(settings)
    results = api.search(q=q, count=limit, result_type=result_type, lang=lang)

    return results
