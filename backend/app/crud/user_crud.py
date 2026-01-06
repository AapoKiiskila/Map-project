from fastapi import HTTPException, status
from app.models import Post, Sighting, User
from app.schemas import post_schema, user_schema
from sqlalchemy import func
from sqlalchemy.orm import Session

def change_username(user_id: int, new_username: user_schema.UserUpdateUsername, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not new_username or not new_username.username.strip() or len(new_username.username) < 2:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Enter a valid username")
  
  user_by_username = db.query(User).filter(User.username == new_username.username).first()
  
  if user_by_username:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This username is taken")
  
  user.username = new_username.username

  db.commit()

  return{"message": "Username has been changed"}

def get_received_sightings(user_id: int, db: Session):
  user = db.query(User).filter(User.id == user_id).first()
  
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sightings = (
    db.query(
      Post.title,
      Post.type,
      Sighting.description,
      Sighting.id,
      Sighting.post_id,
      Sighting.user_id,
      Sighting.time_created,
      Sighting.is_read,
      User.username,
    )
    .join(Post, User.id == Post.user_id)
    .join(Sighting, Post.id == Sighting.post_id)
    .filter(Post.user_id == user_id)
    .order_by(Sighting.time_created.desc())
    .all()
  )

  return sightings

def get_created_sightings(user_id, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sightings = (
    db.query(
      Post.title,
      Sighting.description,
      Sighting.id,
      Sighting.post_id,
      Sighting.user_id,
      Sighting.time_created,
    )
    .join(Post, Sighting.post_id == Post.id)
    .filter(Sighting.user_id == user_id)
    .order_by(Sighting.time_created.desc())
    .all()
  )

  return sightings

def get_user_posts(user_id: int, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  posts = db.query(Post).filter(Post.user_id == user_id).order_by(Post.time_created.desc()).all()

  return posts

def update_post(user_id: int, post_id: str, update_data: post_schema.PostUpdate, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(Post).filter(Post.id == post_id).first()

  if not post:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
  
  if update_data.title:
    post.title = update_data.title

  if update_data.details:
    post.details = update_data.details

  if update_data.type:
    post.type = update_data.type

  db.commit()

  return {"message": "Post has been updated"}

def get_unread_sightings_count(user_id: int, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  count = (
    db.query(func.count(Sighting.id))
    .join(Post, Post.id == Sighting.post_id)
    .filter(Post.user_id == user_id, Sighting.is_read == False)
    .scalar()
  )

  return {"count": count}
