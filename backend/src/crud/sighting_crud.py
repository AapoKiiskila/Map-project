import fastapi
import src.models
import src.schemas.sighting_schema
import src.websocket_connection_manager
import sqlalchemy
import sqlalchemy.orm

async def create_sighting(new_sighting: src.schemas.sighting_schema.SightingCreate, user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(src.models.Post).filter(src.models.Post.id == new_sighting.post_id).first()

  if not post:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Could not find this post")
  
  if not new_sighting.description or not new_sighting.description.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Description cannot be empty")
  
  db_sighting = src.models.Sighting(
    description = new_sighting.description,
    user_id = user_id,
    post_id = new_sighting.post_id
  )

  db.add(db_sighting)
  db.commit()

  count = (
    db.query(sqlalchemy.func.count(src.models.Sighting.id))
    .join(src.models.Post, src.models.Post.id == src.models.Sighting.post_id)
    .filter(src.models.Post.user_id == post.user_id, src.models.Sighting.is_read == False)
    .scalar()
  )
  print(post.user_id)
  await src.websocket_connection_manager.manager.send_unread_sightings_count(post.user_id, count)

  return {"message": "Sighting created successfully"}

async def delete_sighting(sighting_id: int, user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sighting = db.query(src.models.Sighting).filter(src.models.Sighting.id == sighting_id).first()

  if not sighting:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Could not find this sighting")
  
  sighting_post_id = sighting.post_id
  
  db.delete(sighting)
  db.commit()

  post = db.query(src.models.Post).filter(src.models.Post.id == sighting_post_id).first()

  if post:
    count = (
      db.query(sqlalchemy.func.count(src.models.Sighting.id))
      .join(src.models.Post, src.models.Post.id == src.models.Sighting.post_id)
      .filter(src.models.Post.user_id == post.user_id, src.models.Sighting.is_read == False)
      .scalar()
    )

    await src.websocket_connection_manager.manager.send_unread_sightings_count(post.user_id, count)

  return {"message": "The sighting has been permanently deleted."}

async def update_sighting_is_read(sighting_id: int, update_data: src.schemas.sighting_schema.SightingUpdateIsRead, user_id: int, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  sighting = db.query(src.models.Sighting).filter(src.models.Sighting.id == sighting_id).first()

  if not sighting:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Sighting not found")
  
  sighting.is_read = update_data.is_read

  db.commit()

  count = (
    db.query(sqlalchemy.func.count(src.models.Sighting.id))
    .join(src.models.Post, src.models.Post.id == src.models.Sighting.post_id)
    .filter(src.models.Post.user_id == user_id, src.models.Sighting.is_read == False)
    .scalar()
  )

  await src.websocket_connection_manager.manager.send_unread_sightings_count(user_id, count)

  return


def get_created_sightings(user_id: int, db: sqlalchemy.orm.Session):
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
    .join(src.models.Post, src.models.Post.id == src.models.Sighting.post_id)
    .join(src.models.User, src.models.User.id == src.models.Sighting.user_id)
    .filter(src.models.Post.user_id == user_id)
    .order_by(src.models.Sighting.time_created.desc())
    .all()
  )

  return sightings

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