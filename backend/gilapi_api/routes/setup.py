from fastapi import APIRouter

from gilapi_api.db import schemas, crud


router = APIRouter(
    prefix="/setup"
)


@router.post("/", response_model=schemas.setup.Setup)
async def setup(setup_schema: schemas.setup.Setup, crud_setup: crud.setup.Setup):
    pass
