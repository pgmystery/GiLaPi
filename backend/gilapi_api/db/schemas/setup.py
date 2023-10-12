from typing import Any

from pydantic import BaseModel, conset, Field

from gilapi_api.db.schemas.gitlab import Gitlab

class SetupAdmin(BaseModel):
    name: str
    client_id: str

    class Config:
        frozen = True


class SetupGitlab(Gitlab):
    admins: None = Field(None, exclude=True)
    admin: SetupAdmin

    class Config:
        frozen = True


class Setup(BaseModel):
    gitlabs: conset(SetupGitlab, min_length=1)

# {
#     "0": [
#         {
#             "name": "test",
#             "url": "http://192.168.1.2:8090"
#         }
#     ],
#     "1": {
#         "clientId": "d4bd5103505c0bfda37267b036705cf0ad7dd70b437176cd1e59d51cdf131761",
#         "gitlab": {
#             "name": "test",
#             "url": "http://192.168.1.2:8090"
#         },
#         "username": "root"
#     }
# }
