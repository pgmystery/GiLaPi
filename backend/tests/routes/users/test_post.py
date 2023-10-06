import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper


USERNAME = "test"


client = TestClient(app)


@pytest.mark.asyncio
async def test_users_post(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/users", json={
        "username": USERNAME,
    })

    assert response.status_code == 201

    response_result = response.json()

    assert response_result["username"] == USERNAME
    assert not response_result["super_admin"]


@pytest.mark.asyncio
async def test_users_post_as_super_admin(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/users", json={
        "username": USERNAME,
        "super_admin": True,
    })

    assert response.status_code == 201

    response_result = response.json()

    assert response_result["username"] == USERNAME
    assert response_result["super_admin"]
