from typing import Optional
from pydantic import BaseModel, HttpUrl

from gilapi_api.db.models.user import UserRole


class User(BaseModel):
    username: str
    # gitlabs: list[UserGitlab] = []


class UserGitlab(BaseModel):
    url: HttpUrl
    username: str
    role: UserRole = UserRole.user
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []
