import fastapi
import src.database
import src.crud.sighting_crud
import src.schemas.sighting_schema
import src.schemas.user_schema
import src.utils
import sqlalchemy.orm

router = fastapi.APIRouter(
  prefix="/sightings",
  tags=["Sightings"],
)

@router.post("/create-sighting", status_code=fastapi.status.HTTP_201_CREATED)
async def create_new_sighting(new_sighting: src.schemas.sighting_schema.SightingCreate, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return await src.crud.sighting_crud.create_sighting(new_sighting, user_id, db)

@router.get("/received-sightings", response_model=list[src.schemas.user_schema.UserReceivedSightings], status_code=fastapi.status.HTTP_200_OK)
def get_my_received_sightings(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.sighting_crud.get_received_sightings(user_id, db)

@router.get("/received-sightings/unread", response_model=src.schemas.user_schema.UserUnreadSightingsCount, status_code=fastapi.status.HTTP_200_OK)
def get_my_unread_sightings(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.sighting_crud.get_unread_sightings_count(user_id, db)

@router.get("/created-sightings", response_model=list[src.schemas.user_schema.UserCreatedSightings], status_code=fastapi.status.HTTP_200_OK)
def get_my_created_sightings(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.sighting_crud.get_created_sightings(user_id, db)

@router.put("/{sighting_id}", status_code=fastapi.status.HTTP_200_OK)
async def mark_sighting_as_read(sighting_id: int, update_data: src.schemas.sighting_schema.SightingUpdateIsRead, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  await src.crud.sighting_crud.update_sighting_is_read(sighting_id, update_data, user_id, db)

@router.delete("/{sighting_id}", status_code=fastapi.status.HTTP_200_OK)
async def delete_one_sighting(sighting_id: int, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return await src.crud.sighting_crud.delete_sighting(sighting_id, user_id, db)
