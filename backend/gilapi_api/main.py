from fastapi import FastAPI

from gilapi_api.routes import users_router


app = FastAPI()
app.include_router(users_router)


@app.get("/")
async def read_root():
    print("READ_ROOT")
    return {"Hello": "World"}
