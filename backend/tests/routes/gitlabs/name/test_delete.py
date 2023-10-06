import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data

client = TestClient(app)


@pytest.mark.asyncio
async def test_gitlabs_delete(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    post_response = client.post("/gitlabs", json=working_post_data)

    assert post_response.status_code == 200

    post_response_result = post_response.json()

    name = post_response_result["name"]
    delete_response = client.delete(f"/gitlabs/{name}")

    assert delete_response.status_code == 200

    delete_response_result = delete_response.json()

    assert delete_response_result["name"] == name


@pytest.mark.asyncio
async def test_gitlabs_delete_not_exist(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    name = "RANDOM_NAME_NOT_EXIST"
    delete_response = client.delete(f"/gitlabs/{name}")
    delete_response_result = delete_response.json()

    assert delete_response.status_code == 404

    assert delete_response_result["detail"] == "Gitlab not found"
