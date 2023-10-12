import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data

client = TestClient(app)


@pytest.mark.asyncio
async def test_gitlabs_post(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/gitlabs", json=working_post_data)

    assert response.status_code == 200

    response_data = response.json()
    assert "admins" not in response_data.keys()


@pytest.mark.asyncio
async def test_gitlabs_post_without_admins(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/gitlabs", json={
        "name": "test",
        "url": "http://localhost/8080",
    })

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_gitlabs_post_without_url(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/gitlabs", json={
        "name": "test",
        "admins": [
            "test_admin",
        ],
    })

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_gitlabs_post_invalid_data(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/gitlabs", json={
        "SOME_RANDOM_KEY": "SOME_RANDOM_VALUE"
    })

    assert response.status_code == 422

    print(response)
