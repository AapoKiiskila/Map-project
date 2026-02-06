import fastapi
import src.models
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
