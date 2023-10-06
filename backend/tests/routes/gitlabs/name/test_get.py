import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data

client = TestClient(app)


@pytest.mark.asyncio
async def test_gitlabs_get_single(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    post_response = client.post("/gitlabs", json=working_post_data)

    assert post_response.status_code == 200

    post_response_result = post_response.json()

    gitlab_name = post_response_result["name"]
    get_response = client.get(f"/gitlabs/{gitlab_name}")

    assert get_response.status_code == 200

    get_response_result = get_response.json()

    assert get_response_result == post_response_result


@pytest.mark.asyncio
async def test_gitlabs_get_single_with_not_existing_name(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    name = "SOME_RANDOM_NAME_WHICH_DONT_EXIST"
    get_response = client.get(f"/gitlabs/{name}")
    get_response_result = get_response.json()

    assert get_response.status_code == 404

    assert get_response_result["detail"] == "Gitlab not found"
