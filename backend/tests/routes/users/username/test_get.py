import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper


USERNAME = "test"


client = TestClient(app)


@pytest.mark.skip()
@pytest.mark.asyncio
async def test_user_get(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    post_response = client.post("/users", json={
        "username": USERNAME,
    })

    assert post_response.status_code == 201

    post_response_data = post_response.json()
    get_response = client.get(f"/users/{USERNAME}")

    assert get_response.status_code == 200

    get_response_result = get_response.json()

    assert get_response_result["username"] == post_response_data["username"]


@pytest.mark.skip()
@pytest.mark.asyncio
async def test_user_get_unknown_user(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    get_response = client.get(f"/users/{USERNAME}")

    assert get_response.status_code == 404

    get_response_result = get_response.json()

    assert get_response_result["detail"] == "User not found"
