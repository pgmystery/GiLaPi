import pytest
from fastapi.testclient import TestClient

from gilapi_api.db.schemas.user import UserGitlab
from gilapi_api.main import app
from tests.conftest import MongoClientHelper


USERNAME = "test"


client = TestClient(app)


@pytest.mark.skip()
@pytest.mark.asyncio
async def test_user_add_gitlab(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    gitlab_post_response = client.post("/gitlabs", json={
        "url": "http://localhost/8080"
    })

    assert gitlab_post_response.status_code == 200

    gitlab_post_response_data = gitlab_post_response.json()

    user_post_response = client.post("/users", json={
        "username": USERNAME,
    })

    assert user_post_response.status_code == 201

    user_post_response_data = user_post_response.json()

    gitlab_data = UserGitlab(
        url=gitlab_post_response_data["url"],
        username=user_post_response_data["username"],
    )

    post_response = client.post(f"/users/{USERNAME}/gitlab", json=gitlab_data.model_dump())

    assert post_response.status_code == 200
