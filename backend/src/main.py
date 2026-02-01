import fastapi
import src.database
import src.routers.auth_router
import src.routers.post_router
import src.routers.sighting_router
import src.routers.user_router
import src.routers.websocket_router

src.database.Base.metadata.create_all(bind=src.database.engine)

app = fastapi.FastAPI()

app.include_router(src.routers.auth_router.router)
app.include_router(src.routers.post_router.router)
app.include_router(src.routers.sighting_router.router)
app.include_router(src.routers.user_router.router)
app.include_router(src.routers.websocket_router.router)
