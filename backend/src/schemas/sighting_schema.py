import pydantic

class SightingCreate(pydantic.BaseModel):
  description: str
  post_id: int

class SightingUpdateIsRead(pydantic.BaseModel):
  is_read: int
