from pydantic import BaseModel

class SightingCreate(BaseModel):
  description: str
  user_id: int
  post_id: int
