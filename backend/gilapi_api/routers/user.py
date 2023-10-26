from fastapi import APIRouter, Depends, HTTPException, status

from gilapi_api.db.schemas.user import UserGitlab as UserGitlabSchema, User as UserSchema, UserResponse
from gilapi_api.db.crud.user import User as UserCRUD
from gilapi_api.db.crud.gitlab import Gitlab as GitlabCRUD
from gilapi_api.routers.projects import router as projects_router


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


router = APIRouter(
    prefix="/users"
)
router.include_router(projects_router)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserSchema, crud_user: UserCRUD = Depends(UserCRUD)):
    existing_user = await crud_user.read(user.gitlabs)

    if existing_user is not None:
        raise HTTPException(status_code=400, detail=f'The User already register')

    new_user = await crud_user.create(user=user)

    if new_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return new_user


@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: str, crud_user: UserCRUD = Depends(UserCRUD)):
    gitlab_crud = GitlabCRUD(mongo_client=crud_user.mongo_client)
    gitlab_db = await gitlab_crud.read(gitlab_name)

    gitlabs = [
        UserGitlabSchema(
            url=gitlab_db["url"],
            username=username,
        )
    ]
    user = await crud_user.read(gitlabs)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("{user_id}/gitlab/{gitlab_id}", response_model=UserSchema)
async def get_gitlab_by_id(user_id: str, gitlab_id: str, crud_user: UserCRUD = Depends(UserCRUD)):
    pass


# @router.post("/{username}/gitlab", response_model=UserSchema)
# async def add_gitlab_to_user(
#     username: str,
#     gitlabs: schemas.user.UserGitlab | list[schemas.user.UserGitlab],
#     crud_user: crud.user.User = Depends(crud.user.User),
# ):
#     if not isinstance(gitlabs, list):
#         gitlabs = [gitlabs]
#
#     crud_gitlab = crud.gitlab.Gitlab(mongo_client=crud_user.mongo_client)
#     for gitlab in gitlabs:
#         existing_gitlab = await crud_gitlab.read(gitlab.url)
#
#         if existing_gitlab is None:
#             raise HTTPException(status_code=404, detail=f"Gitlab with the url '{gitlab.url}' not found")
#
#     for gitlab in gitlabs:
#         await crud_user.add_gitlab(username, gitlab)
#
#     return status.HTTP_200_OK
