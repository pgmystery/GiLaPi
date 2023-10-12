from fastapi import APIRouter, Depends, HTTPException, status

from gilapi_api.db import schemas, crud
from gilapi_api.routers.projects import router as projects_router


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


router = APIRouter(
    prefix="/users"
)
router.include_router(projects_router)


@router.post("/", response_model=schemas.user.User, status_code=status.HTTP_201_CREATED)
async def create_user(user: schemas.user.User, crud_user: crud.user.User = Depends(crud.user.User)):
    existing_user = await crud_user.get()
    print(existing_user)

    if existing_user:
        raise HTTPException(status_code=400, detail=f'User with the username "{user.username}" already registered')

    new_user = await crud_user.create(user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return new_user


@router.get("/{username}", response_model=schemas.user.User)
async def get_user(username: str, crud_user: crud.user.User = Depends(crud.user.User)):
    user = await crud_user.get(username=username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.post("/{username}/gitlab", response_model=schemas.user.User)
async def add_gitlab_to_user(
    username: str,
    gitlabs: schemas.user.UserGitlab | list[schemas.user.UserGitlab],
    crud_user: crud.user.User = Depends(crud.user.User),
):
    if not isinstance(gitlabs, list):
        gitlabs = [gitlabs]

    crud_gitlab = crud.gitlab.Gitlab(mongo_client=crud_user.mongo_client)
    for gitlab in gitlabs:
        existing_gitlab = await crud_gitlab.get(gitlab.url)

        if existing_gitlab is None:
            raise HTTPException(status_code=404, detail=f"Gitlab with the url '{gitlab.url}' not found")

    for gitlab in gitlabs:
        await crud_user.add_gitlab(username, gitlab)

    return status.HTTP_200_OK
