import fastapi
import src.models
import src.schemas.sighting_schema
import src.websocket_connection_manager
import sqlalchemy
import sqlalchemy.orm

async def create_sighting(new_sighting: src.schemas.sighting_schema.SightingCreate, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == new_sighting.user_id).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="User not found")
  
  post = db.query(src.models.Post).filter(src.models.Post.id == new_sighting.post_id).first()

  if not post:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND, detail="Could not find this post")
  
  if not new_sighting.description or not new_sighting.description.strip():
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_400_BAD_REQUEST, detail="Description cannot be empty")
  
  db_sighting = src.models.Sighting(
    description = new_sighting.description,
    user_id = new_sighting.user_id,
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
  
  await src.websocket_connection_manager.manager.send_unread_sightings_count(post.user_id, count)

  return {"message": "Sighting created successfully"}

async def delete_sighting(user_id: int, sighting_id: int, db: sqlalchemy.orm.Session):
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

async def update_sighting_is_read(sighting_id: int, update_data: src.schemas.sighting_schema.SightingUpdateIsRead, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.id == update_data.user_id).first()

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
    .filter(src.models.Post.user_id == update_data.user_id, src.models.Sighting.is_read == False)
    .scalar()
  )

  await src.websocket_connection_manager.manager.send_unread_sightings_count(update_data.user_id, count)

  return
