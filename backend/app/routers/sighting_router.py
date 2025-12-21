from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import sighting_crud
from app.schemas import sighting_schema
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/sightings/create-sighting", status_code=status.HTTP_201_CREATED)
def create_new_sighting(new_sighting: sighting_schema.SightingCreate, db: Session = Depends(get_db)):
  return sighting_crud.create_sighting(new_sighting, db)

@router.get("/sightings/{user_id}/received", response_model=list[sighting_schema.SightingFetchReceived], status_code=status.HTTP_200_OK)
def get_my_received_sightings(user_id: int, db: Session = Depends(get_db)):
  return sighting_crud.get_received_sightings(user_id, db)