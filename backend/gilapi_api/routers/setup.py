from fastapi import APIRouter, Depends, status

from gilapi_api.db.schemas.setup import Setup as SetupSchema
from gilapi_api.db.crud.setup import Setup as SetupCRUD
from gilapi_api.dependencies.setup import verify_setup


router = APIRouter(
    prefix="/setup",
    dependencies=[Depends(verify_setup)],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def init_setup(setup_schema: SetupSchema, crud_setup: SetupCRUD = Depends(SetupCRUD)):
    await crud_setup.create(setup_schema)
