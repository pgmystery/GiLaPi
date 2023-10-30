from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from gilapi_api.routers import users_router, gitlabs_router, setup_router


origins = [
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(setup_router)
app.include_router(gitlabs_router)
app.include_router(users_router)


@app.get("/")
async def read_root():
    print("READ_ROOT")
    return {"Hello": "World"}
