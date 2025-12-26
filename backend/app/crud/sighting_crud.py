from fastapi import HTTPException, status
from app.models import Post, Sighting, User
from app.schemas import sighting_schema
from sqlalchemy.orm import Session

def create_sighting(new_sighting: sighting_schema.SightingCreate, db: Session):
  user = db.query(User).filter(User.id == new_sighting.user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(Post).filter(Post.id == new_sighting.post_id).first()

  if not post:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find this post")
  
  if not new_sighting.description or not new_sighting.description.strip():
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Description cannot be empty")
  
  db_sighting = Sighting(
    description = new_sighting.description,
    user_id = new_sighting.user_id,
    post_id = new_sighting.post_id
  )

  db.add(db_sighting)
  db.commit()

  return {"message": "Sighting created successfully"}

def delete_sighting(user_id: int, sighting_id: int, db: Session):
  user = db.query(User).filter(User.id == user_id).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sighting = db.query(Sighting).filter(Sighting.id == sighting_id).first()

  if not sighting:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find this sighting")
  
  db.delete(sighting)
  db.commit()

  return {"message": "The sighting has been permanently deleted."}
