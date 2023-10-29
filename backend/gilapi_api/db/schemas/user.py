from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel, HttpUrl, conlist


class UserGitlab(BaseModel):
    url: HttpUrl
    username: str
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []


class User(BaseModel):
    gitlabs: conlist(UserGitlab, min_length=1)


@dataclass
class UserGitlabResponse:
    id: str
    url: HttpUrl
    name: str
    username: str


@dataclass
class UserResponse:
    id: str
    gitlabs: conlist(UserGitlabResponse, min_length=1)
