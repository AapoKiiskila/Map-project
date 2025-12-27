from fastapi import APIRouter, Depends, status
from app.database import get_db
from app.crud import post_crud, sighting_crud, user_crud
from app.schemas import post_schema, user_schema
from sqlalchemy.orm import Session

router = APIRouter()

@router.put("/users/{user_id}/update-username", status_code=status.HTTP_200_OK)
def change_new_username(user_id: int, new_username: user_schema.UsernameUpdate, db: Session = Depends(get_db)):
  return user_crud.change_username(user_id, new_username, db)

@router.get("/users/{user_id}/received-sightings", response_model=list[user_schema.UserReceivedSightings], status_code=status.HTTP_200_OK)
def get_my_received_sightings(user_id: int, db: Session = Depends(get_db)):
  return user_crud.get_received_sightings(user_id, db)

@router.get("/users/{user_id}/created-sightings", response_model=list[user_schema.UserCreatedSightings], status_code=status.HTTP_200_OK)
def get_my_created_sightings(user_id: int, db: Session = Depends(get_db)):
  return user_crud.get_created_sightings(user_id, db)

@router.get("/users/{user_id}/posts", response_model=list[post_schema.PostFetchMyPosts], status_code=status.HTTP_200_OK)
def fetch_user_posts(user_id: int, db: Session = Depends(get_db)):
  return user_crud.get_user_posts(user_id, db)

@router.put("/users/{user_id}/posts/{post_id}", status_code=status.HTTP_200_OK)
def update_one_post(user_id: int, post_id: int, update_data: post_schema.PostUpdate, db: Session = Depends(get_db)):
  return user_crud.update_post(user_id, post_id, update_data, db)

@router.delete("/users/{user_id}/posts/{post_id}", status_code=status.HTTP_200_OK)
def delete_one_post(user_id: int, post_id: int, db: Session = Depends(get_db)):
  return post_crud.delete_post(user_id, post_id, db)

@router.delete("/users/{user_id}/sightings/{sighting_id}", status_code=status.HTTP_200_OK)
def delete_one_sighting(user_id: int, sighting_id: int, db: Session = Depends(get_db)):
  return sighting_crud.delete_sighting(user_id, sighting_id, db)