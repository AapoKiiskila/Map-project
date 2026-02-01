import fastapi
import src.models
import src.schemas.post_schema
import src.schemas.user_schema
import sqlalchemy
import sqlalchemy.orm
import src.utils

def get_user(user_id: int, db: sqlalchemy.orm.Session):
  if not user_id:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Error while fetching user data")
  
  user_data = (
    db.query(
      src.models.User.id,
      src.models.User.username,
      src.models.User.email
    )
    .filter(src.models.User.id == user_id)
    .first()
  )

  return user_data

def create_user(new_user: src.schemas.user_schema.UserCreate, db: sqlalchemy.orm.Session):
  if not new_user.username or not new_user.username.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="A valid username is required")
  
  if not new_user.email or not new_user.email.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="A valid email address is required")
  
  if not new_user.plain_password or not new_user.plain_password.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="A valid password is required")
  
  user_by_username = db.query(src.models.User).filter(src.models.User.username == new_user.username).first()

  if user_by_username:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="An account with this username already exists")
  
  user_by_email = db.query(src.models.User).filter(src.models.User.email == new_user.email).first()

  if user_by_email:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="An account with this email address already exists")
  
  new_hashed_password = src.utils.hash_password(new_user.plain_password)

  db_new_user = src.models.User(
    username = new_user.username,
    email = new_user.email,
    hashed_password = new_hashed_password
  )

  db.add(db_new_user)
  db.commit()

  return{"message": "A new account has been successfully created"}


def change_username(user_id: int, new_username: src.schemas.user_schema.UserUpdateUsername, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not new_username or not new_username.username.strip() or len(new_username.username) < 2:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Enter a valid username")
  
  user_by_username = db.query(src.models.User).filter(src.models.User.username == new_username.username).first()
  
  if user_by_username:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="This username is taken")
  
  user.username = new_username.username

  db.commit()

  return{"message": "Username has been changed", "username": new_username.username}

def change_email(user_id: int, new_email: src.schemas.user_schema.UserUpdateEmail, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not new_email:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Enter a valid email address")
  
  user_by_email = db.query(src.models.User).filter(src.models.User.email == new_email.email).first()
  
  if user_by_email:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="An account with this email address already exists")
  
  user.email = new_email.email

  db.commit()

  return{"message": "Email address has been changed", "email": new_email.email}

def get_received_sightings(user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()
  
  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sightings = (
    db.query(
      src.models.Post.title,
      src.models.Post.type,
      src.models.Sighting.description,
      src.models.Sighting.id,
      src.models.Sighting.post_id,
      src.models.Sighting.user_id,
      src.models.Sighting.time_created,
      src.models.Sighting.is_read,
      src.models.User.username,
    )
    .join(src.models.Post, src.models.User.id == src.models.Post.user_id)
    .join(src.models.Sighting, src.models.Post.id == src.models.Sighting.post_id)
    .filter(src.models.Post.user_id == user_id)
    .order_by(src.models.Sighting.time_created.desc())
    .all()
  )

  return sightings

def get_created_sightings(user_id, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sightings = (
    db.query(
      src.models.Post.title,
      src.models.Sighting.description,
      src.models.Sighting.id,
      src.models.Sighting.post_id,
      src.models.Sighting.user_id,
      src.models.Sighting.time_created,
    )
    .join(src.models.Post, src.models.Sighting.post_id == src.models.Post.id)
    .filter(src.models.Sighting.user_id == user_id)
    .order_by(src.models.Sighting.time_created.desc())
    .all()
  )

  return sightings

def get_user_posts(user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  posts = db.query(src.models.Post).filter(src.models.Post.user_id == user_id).order_by(src.models.Post.time_created.desc()).all()

  return posts

def update_post(user_id: int, post_id: str, update_data: src.schemas.post_schema.PostUpdate, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(src.models.Post).filter(src.models.Post.id == post_id).first()

  if not post:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Post not found")
  
  if update_data.title:
    post.title = update_data.title

  if update_data.details:
    post.details = update_data.details

  if update_data.type:
    post.type = update_data.type

  db.commit()

  return {"message": "Post has been updated"}

def get_unread_sightings_count(user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  count = (
    db.query(sqlalchemy.func.count(src.models.Sighting.id))
    .join(src.models.Post, src.models.Post.id == src.models.Sighting.post_id)
    .filter(src.models.Post.user_id == user_id, src.models.Sighting.is_read == False)
    .scalar()
  )

  return {"count": count}
