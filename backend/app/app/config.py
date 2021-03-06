from pathlib import Path
from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    twitter_consumer_key: str
    twitter_consumer_secret: str
    twitter_access_token: str
    twitter_access_token_secret: str
    allow_origins: List[str]

    class Config:
        env_file = Path(".env")
