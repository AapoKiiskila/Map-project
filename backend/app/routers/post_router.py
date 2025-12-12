from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import post_crud
from app.schemas import post_schema
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/posts/create-post", status_code=status.HTTP_201_CREATED)
def create(new_post: post_schema.PostCreate, db: Session = Depends(get_db)):
  return post_crud.create_post(new_post, db)
