from fastapi import APIRouter, Depends, status

from gilapi_api.db.schemas.setup import Setup as SetupSchema
from gilapi_api.db.crud.setup import Setup as SetupCRUD
from gilapi_api.dependencies.setup import verify_setup


router = APIRouter(
    prefix="/setup",
)


@router.get("/", status_code=status.HTTP_200_OK)
async def check_setup(crud_setup: SetupCRUD = Depends(SetupCRUD)):
    return await crud_setup.read()


@router.post("/", dependencies=[Depends(verify_setup)], status_code=status.HTTP_201_CREATED)
async def init_setup(setup_schema: SetupSchema, crud_setup: SetupCRUD = Depends(SetupCRUD)):
    await crud_setup.create(setup_schema)
