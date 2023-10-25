import pytest_asyncio
from fastapi.testclient import TestClient

from gilapi_api.db import get_mongo_client
from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data_gitlabs


class TestUser:
    USERNAME = "test"
    client = TestClient(app)
    mock_gitlab = working_post_data_gitlabs

    @pytest_asyncio.fixture(scope="class", autouse=True)
    async def drop_db_and_add_gitlab(self):
        mongo_client = MongoClientHelper(get_mongo_client())
        await mongo_client.drop_database()
        self.client.post("/gitlabs", json=self.mock_gitlab)
