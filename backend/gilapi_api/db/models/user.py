from typing import Optional
from pydantic import conlist, HttpUrl

from gilapi_api.db.utils.mongo_model import MongoModel


class UserGitlab(MongoModel):
    url: HttpUrl
    username: str
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []


class User(MongoModel):
    gitlabs: conlist(UserGitlab, min_length=1)
