from fastapi import HTTPException, status
from app.models import Post, User
from app.schemas import post_schema
from sqlalchemy.orm import Session

def get_all_posts(db: Session):
  posts = db.query(Post).all()
  
  return posts

def get_one_post(post_id: int, db: Session):
  post = db.query(Post).filter(Post.id == post_id).first()

  if not post:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find this post")
  
  return post

def create_post(new_post: post_schema.PostCreate, db: Session):
  user = db.query(User).filter(User.id == new_post.user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not new_post.title or not new_post.title.strip():
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty")
  
  if not new_post.details or not new_post.details.strip():
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Details cannot be empty")
  
  if not new_post.type or not new_post.type.strip():
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type is required")
  
  if not (-90 <= new_post.latitude <= 90) or not (-180 <= new_post.longitude <= 180):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid latitude/longitude")
  
  db_post = Post(
    title=new_post.title,
    details=new_post.details,
    type=new_post.type,
    latitude=new_post.latitude,
    longitude=new_post.longitude,
    user_id=new_post.user_id
  )

  db.add(db_post)
  db.commit()

  return {"message": "Post created successfully"}
