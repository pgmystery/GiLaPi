from typing import Optional
from pydantic import BaseModel

from gilapi_api.db.models.user import UserRole


class User(BaseModel):
    name: str
    role: UserRole
    gitlab_oauth_client_id: Optional[str] = None
