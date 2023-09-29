from motor import motor_asyncio

from gilapi_api.settings import get_settings


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

    yield db
