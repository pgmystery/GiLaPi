from fastapi import Depends, HTTPException

from gilapi_api.db import crud


async def verify_setup(crud_gitlab: crud.gitlab.Gitlab = Depends(crud.gitlab.Gitlab)):
    gitlabs = await crud_gitlab.get_all()

    if len(gitlabs) > 0:
        raise HTTPException(status_code=404)
