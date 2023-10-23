import pytest
import pytest_asyncio
from fastapi.testclient import TestClient

from gilapi_api.db import get_mongo_client
from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data_gitlabs


USERNAME = "test"

client = TestClient(app)


class TestUserPost:
    @pytest_asyncio.fixture(scope="class", autouse=True)
    async def drop_db_and_add_gitlab(self):
        mongo_client = MongoClientHelper(get_mongo_client())
        await mongo_client.drop_database()
        client.post("/gitlabs", json=working_post_data_gitlabs)

    # @pytest.mark.skip()
    @pytest.mark.asyncio
    async def test_users_post(self):
        response = client.post("/users", json={
            "gitlabs": [
                {
                    "username": USERNAME,
                    "url": working_post_data_gitlabs["url"],
                    "gitlab_oauth_client_id": "test",
                }
            ]
        })

        assert response.status_code == 201

        response_result = response.json()

        assert response_result["username"] == USERNAME


    @pytest.mark.skip()
    @pytest.mark.asyncio
    async def test_users_post_as_super_admin(self, mongo_client: MongoClientHelper):
        await mongo_client.drop_database()

        response = client.post("/users", json={
            "username": USERNAME,
            "super_admin": True,
        })

        assert response.status_code == 201

        response_result = response.json()

        assert response_result["username"] == USERNAME
        assert response_result["super_admin"]
