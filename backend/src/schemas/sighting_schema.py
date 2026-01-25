import pydantic

class SightingCreate(pydantic.BaseModel):
  description: str
  user_id: int
  post_id: int

class SightingUpdateIsRead(pydantic.BaseModel):
  is_read: int
  user_id: int
