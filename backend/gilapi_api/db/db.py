from motor import motor_asyncio
from motor.core import AgnosticClient, AgnosticDatabase
from pydantic import BaseModel

from gilapi_api.settings import get_settings


class MongoClient(BaseModel):
    client: AgnosticClient
    db: AgnosticDatabase

    class Config:
        arbitrary_types_allowed = True


def get_mongo_client():
    settings = get_settings()
    mongo_client_config = settings.db.get_mongo_client_config()

    client = motor_asyncio.AsyncIOMotorClient(
        host=mongo_client_config.host,
        port=mongo_client_config.port,
        username=mongo_client_config.username,
        password=mongo_client_config.password,
    )
    db = client[mongo_client_config.db]

    mongo_client = MongoClient(
        client=client,
        db=db,
    )

    return mongo_client
