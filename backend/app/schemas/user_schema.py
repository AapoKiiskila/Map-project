from datetime import datetime
from pydantic import BaseModel

class UserUpdateUsername(BaseModel):
  username: str

class UserReceivedSightings(BaseModel):
  title: str
  type: str
  description: str
  id: int
  post_id: int
  user_id: int
  time_created: datetime
  username: str

class UserCreatedSightings(BaseModel):
  title: str
  description: str
  id: int
  post_id: int
  user_id: int
  time_created: datetime
