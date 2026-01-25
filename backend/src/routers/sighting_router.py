import fastapi
import src.database
import src.crud.sighting_crud
import src.schemas.sighting_schema
import sqlalchemy.orm

router = fastapi.APIRouter()

@router.post("/sightings/create-sighting", status_code=fastapi.status.HTTP_201_CREATED)
async def create_new_sighting(new_sighting: src.schemas.sighting_schema.SightingCreate, db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return await src.crud.sighting_crud.create_sighting(new_sighting, db)

@router.put("/sightings/{sighting_id}", status_code=fastapi.status.HTTP_200_OK)
async def mark_sighting_as_read(sighting_id: int, update_data: src.schemas.sighting_schema.SightingUpdateIsRead, db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  await src.crud.sighting_crud.update_sighting_is_read(sighting_id, update_data, db)
