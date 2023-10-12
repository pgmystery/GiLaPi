from fastapi import APIRouter


router = APIRouter(
    prefix="/projects"
)


@router.get("/")
async def get_projects():
    pass


@router.post("/")
async def add_project():
    pass


@router.delete("/{namespace}")
async def delete_project(namespace: str):
    pass
