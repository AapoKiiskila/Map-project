from fastapi import HTTPException, status
from app.models import User
from app.schemas import user_schema
from sqlalchemy.orm import Session

def change_username(user_id: int, new_username: user_schema.UsernameUpdate, db: Session):
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
