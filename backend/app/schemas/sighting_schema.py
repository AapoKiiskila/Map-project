from pydantic import BaseModel
from datetime import datetime

class SightingCreate(BaseModel):
  description: str
  user_id: int
  post_id: int

class SightingFetchReceived(BaseModel):
  title: str
  description: str
  username: str
  time_created: datetime
