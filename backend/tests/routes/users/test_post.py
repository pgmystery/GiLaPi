import pytest

from tests.routes.gitlabs.data import working_post_data_gitlabs
from tests.routes.users.mock.utils import TestUser


class TestUserPost(TestUser):
    @pytest.mark.asyncio
    async def test_users_post(self):
        response = self.client.post("/users", json={
            "gitlabs": [
                {
                    "username": self.USERNAME,
                    "url": working_post_data_gitlabs["url"],
                    "gitlab_oauth_client_id": "test",
                }
            ]
        })

        assert response.status_code == 201

        response_result = response.json()

        assert response_result == {
            "gitlabs": [
                {
                    "url": working_post_data_gitlabs["url"],
                    "username": working_post_data_gitlabs["name"],
                },
            ],
        }
