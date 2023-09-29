from fastapi import APIRouter, Depends, HTTPException

from gilapi_api.db import schemas, crud, get_mongo_client


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


router = APIRouter(
    prefix="/users"
)


@router.post("/", response_model=schemas.user.User)
async def create_user(user: schemas.user.User, db = Depends(get_mongo_client)):
    print("create_user")
    print(user)
    existing_user = await crud.user.get(db, username=user.name)
    print(existing_user)

    if existing_user:
        raise HTTPException(status_code=400, detail=f'User with the username "{user.name}" already registered')

    new_user = await crud.user.create(db=db, user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return new_user


@router.get("/{username}", response_model=schemas.User)
async def get_user(username: str, db = Depends(get_mongo_client)):
    user = await crud.user.get(db, username=username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
