import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.gitlabs.data import working_post_data_gitlabs

client = TestClient(app)


@pytest.mark.asyncio
async def test_gitlabs_get_all_empty(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    get_response = client.get("/gitlabs")
    result = get_response.json()

    assert isinstance(result, list)
    assert len(result) == 0


@pytest.mark.asyncio
async def test_gitlabs_get_all_with_data(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    post_response = client.post("/gitlabs", json=working_post_data_gitlabs)

    assert post_response.status_code == 200

    post_response_result = post_response.json()

    get_response = client.get("/gitlabs")

    assert get_response.status_code == 200

    get_response_result = get_response.json()

    assert post_response_result in get_response_result
