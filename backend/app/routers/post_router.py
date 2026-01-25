from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import post_crud
from app.schemas import post_schema
from decimal import Decimal
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/posts", response_model=list[post_schema.PostFetchAllPosts], status_code=status.HTTP_200_OK)
def fetch_all_posts(db: Session = Depends(get_db), id: int | None = None, latitude: Decimal | None = None, longitude: Decimal | None = None):
  return post_crud.get_all_posts(id, latitude, longitude, db)

@router.get("/posts/{post_id}", response_model=post_schema.PostFetchOnePost, status_code=status.HTTP_200_OK)
def fetch_one_post(post_id: int, db: Session = Depends(get_db)):
  return post_crud.get_one_post(post_id, db)

@router.post("/posts/create-post", status_code=status.HTTP_201_CREATED)
def create_new_post(new_post: post_schema.PostCreate, db: Session = Depends(get_db)):
  return post_crud.create_post(new_post, db)
