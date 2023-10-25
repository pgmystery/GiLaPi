from fastapi import APIRouter, Depends, HTTPException

from gilapi_api.db import schemas, crud


router = APIRouter(
    prefix="/gitlabs"
)


@router.get("/", response_model=list[schemas.gitlab.GitlabResponse])
async def get_gitlabs(crud_gitlab: crud.gitlab.Gitlab = Depends(crud.gitlab.Gitlab)):
    gitlabs = await crud_gitlab.read_all()

    return gitlabs


@router.get("/{name}", response_model=schemas.gitlab.GitlabResponse)
async def get_gitlab(name: str, crud_gitlab: crud.gitlab.Gitlab = Depends(crud.gitlab.Gitlab)):
    gitlab = await crud_gitlab.read(name, key="name")

    if gitlab is None:
        raise HTTPException(status_code=404, detail="Gitlab not found")

    return gitlab


@router.post("/", response_model=schemas.gitlab.GitlabResponse)
async def add_gitlab(gitlab: schemas.gitlab.Gitlab, crud_gitlab: crud.gitlab.Gitlab = Depends(crud.gitlab.Gitlab)):
    new_gitlab = await crud_gitlab.create(gitlab=gitlab)

    if new_gitlab is None:
        raise HTTPException(status_code=404, detail="Gitlab not found")

    return new_gitlab


@router.delete("/{name}", response_model=schemas.gitlab.GitlabResponse)
async def delete_gitlab(name: str, crud_gitlab: crud.gitlab.Gitlab = Depends(crud.gitlab.Gitlab)):
    gitlab = await crud_gitlab.delete(name=name)

    if gitlab is None:
        raise HTTPException(status_code=404, detail="Gitlab not found")

    return gitlab
