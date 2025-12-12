from app.database import Base, engine
from fastapi import FastAPI
from app.routers import post_router, user_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(post_router.router)
app.include_router(user_router.router)
