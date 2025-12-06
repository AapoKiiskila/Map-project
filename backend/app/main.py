from app.database import Base, engine
from fastapi import FastAPI
from app.routers import post_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(post_router.router)
