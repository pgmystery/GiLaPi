from fastapi import APIRouter, Depends

from gilapi_api.db import schemas, crud
from gilapi_api.dependencies.setup import verify_setup


router = APIRouter(
    prefix="/setup",
    dependencies=[Depends(verify_setup)],
)


# @router.post("/", response_model=schemas.setup.Setup)
@router.post("/")
async def init_setup(setup_schema: schemas.setup.Setup, crud_setup: crud.setup.Setup = Depends(crud.setup.Setup)):
    print(setup_schema)

    await crud_setup.create(setup_schema)
