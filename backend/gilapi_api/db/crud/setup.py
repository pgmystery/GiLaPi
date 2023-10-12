from gilapi_api.db.utils.crud_model import CRUDModel
from gilapi_api.db.schemas.setup import Setup as SetupSchema


class Setup(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("setup", mongo_client=mongo_client)

    async def add(self, setup_data: SetupSchema):
        for gitlab in setup_data.gitlabs:
            print(gitlab)
