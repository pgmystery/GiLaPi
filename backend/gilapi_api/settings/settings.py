from functools import lru_cache
from pydantic_settings import BaseSettings

from gilapi_api.settings.db import DBSettings


class Settings(BaseSettings):
    db: DBSettings


@lru_cache()
def get_settings():
    return Settings(
        db=DBSettings(),
    )
