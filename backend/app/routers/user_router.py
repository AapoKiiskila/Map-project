from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import user_crud
from app.schemas import user_schema
from sqlalchemy.orm import Session

router = APIRouter()

@router.put("/users/{user_id}/update-username", status_code=status.HTTP_200_OK)
def change_new_username(user_id: int, new_username: user_schema.UsernameUpdate, db: Session = Depends(get_db)):
  return user_crud.change_username(user_id, new_username, db)