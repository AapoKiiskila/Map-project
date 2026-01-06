from pydantic import BaseModel

class SightingCreate(BaseModel):
  description: str
  user_id: int
  post_id: int

class SightingUpdateIsRead(BaseModel):
  is_read: int
  user_id: int
