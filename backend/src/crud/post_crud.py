import decimal
import fastapi
import src.models
import src.schemas.post_schema
import sqlalchemy.orm

def get_all_posts(id: int | None, latitude: decimal.Decimal | None, longitude: decimal.Decimal | None, db: sqlalchemy.orm.Session):
  if not id or id < 1 or not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Bad request")
  
  min_latitude = latitude - 5
  max_latitude = latitude + 5
  min_longitude = longitude - 5
  max_longitude = longitude + 5
  
  posts_nearby = (
    db.query(src.models.Post)
    .filter(min_latitude <= src.models.Post.latitude)
    .filter(src.models.Post.latitude <= max_latitude)
    .filter(min_longitude <= src.models.Post.longitude)
    .filter(src.models.Post.longitude <= max_longitude)
    .filter(src.models.Post.user_id != id)
    .all()
  )

  my_posts = db.query(src.models.Post).filter(src.models.Post.user_id == id).all()

  posts = posts_nearby + my_posts
  
  return posts

def get_one_post(post_id: int, db: sqlalchemy.orm.Session):
  post = db.query(src.models.Post).filter(src.models.Post.id == post_id).first()

  if not post:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Could not find this post")
  
  return post

def create_post(new_post: src.schemas.post_schema.PostCreate, user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not new_post.title or not new_post.title.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty")
  
  if not new_post.details or not new_post.details.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Details cannot be empty")
  
  if not new_post.type or not new_post.type.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Type is required")
  
  if not (-90 <= new_post.latitude <= 90) or not (-180 <= new_post.longitude <= 180):
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Invalid latitude/longitude")
  
  db_post = src.models.Post(
    title=new_post.title,
    details=new_post.details,
    type=new_post.type,
    latitude=new_post.latitude,
    longitude=new_post.longitude,
    user_id=user_id
  )

  db.add(db_post)
  db.commit()

  return {"message": "Post created successfully"}

def delete_post(user_id: int, post_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(src.models.Post).filter(src.models.Post.id == post_id).first()

  if not post:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Post not found")
  
  db.delete(post)
  db.commit()

  return {"message": "The post has been permanently deleted"}
