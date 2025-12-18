from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class PostFetchResponse(BaseModel):
  id: int
  user_id: int
  type: str
  latitude: Decimal
  longitude: Decimal

class PostDataResponse(BaseModel):
  title: str
  details: str

class PostCreate(BaseModel):
  title: str
  details: str
  type: str
  latitude: Decimal
  longitude: Decimal
  user_id: int

class PostFetchMyPosts(BaseModel):
  id: int
  title: str
  time_created: datetime
