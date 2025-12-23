from pydantic import BaseModel
from datetime import datetime

class SightingCreate(BaseModel):
  description: str
  user_id: int
  post_id: int

class SightingFetchReceived(BaseModel):
  title: str
  description: str
  id: int
  post_id: int
  user_id: int
  time_created: datetime
  username: str

