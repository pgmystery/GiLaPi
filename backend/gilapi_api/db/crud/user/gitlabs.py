from gilapi_api.db.utils.crud_model import CRUDModel


class UserGitlabs(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("user_gitlabs", mongo_client=mongo_client)

    async def add(self):
        pass
