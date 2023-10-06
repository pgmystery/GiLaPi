from enum import IntEnum
from typing import Optional

from gilapi_api.db.models import Gitlab
from gilapi_api.db.models.project import Project
from gilapi_api.db.utils.mongo_model import MongoModel


class UserRole(IntEnum):
    admin = 0
    user = 1


class UserGitlab(MongoModel):
    gitlab_url: Gitlab
    username: str
    role: UserRole = UserRole.user
    gitlab_oauth_client_id: Optional[str] = None
    projects: list[Project] = []


class User(MongoModel):
    username: str
    super_admin: bool = False
    gitlabs: list[UserGitlab] = []
