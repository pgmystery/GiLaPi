from typing import Optional
from pydantic import BaseModel, HttpUrl, conlist


class UserGitlab(BaseModel):
    url: HttpUrl
    username: str
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []


class User(BaseModel):
    gitlabs: conlist(UserGitlab, min_length=1)
