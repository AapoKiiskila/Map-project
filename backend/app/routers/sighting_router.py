from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import sighting_crud
from app.schemas import sighting_schema
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/sightings/create-sighting", status_code=status.HTTP_201_CREATED)
async def create_new_sighting(new_sighting: sighting_schema.SightingCreate, db: Session = Depends(get_db)):
  return await sighting_crud.create_sighting(new_sighting, db)

@router.put("/sightings/{sighting_id}", status_code=status.HTTP_200_OK)
async def mark_sighting_as_read(sighting_id: int, update_data: sighting_schema.SightingUpdateIsRead, db: Session = Depends(get_db)):
  await sighting_crud.update_sighting_is_read(sighting_id, update_data, db)
