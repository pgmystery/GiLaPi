from fastapi import FastAPI

from gilapi_api.routers import users_router, gitlabs_router, setup_router


app = FastAPI()
app.include_router(setup_router)
app.include_router(gitlabs_router)
app.include_router(users_router)


@app.get("/")
async def read_root():
    print("READ_ROOT")
    return {"Hello": "World"}
