from enum import IntEnum
from typing import Optional

from gilapi_api.db.models.project import Project
from gilapi_api.db.utils.mongo_model import MongoModel


class UserRole(IntEnum):
    admin = 0
    user = 1


class User(MongoModel):
    name: str
    role: UserRole
    gitlab_oauth_client_id: Optional[str] = None
    projects: list[Project] = []
