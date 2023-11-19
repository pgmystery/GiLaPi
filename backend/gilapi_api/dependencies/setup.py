from fastapi import Depends, HTTPException

from gilapi_api.db.crud.setup import Setup as SetupCRUD


async def verify_setup(crud_setup: SetupCRUD = Depends(SetupCRUD)):
    is_setup_finish = await crud_setup.read()

    if is_setup_finish:
        raise HTTPException(status_code=404)
