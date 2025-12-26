from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel

class PostFetchResponse(BaseModel):
  id: int
  user_id: int
  type: str
  latitude: Decimal
  longitude: Decimal

class PostDataResponse(BaseModel):
  title: str
  details: str
  time_created: datetime
  time_updated: datetime
  user_id: int

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
  type: str
  time_created: datetime

class PostUpdate(BaseModel):
  title: str | None = None
  details: str | None = None
  type: str | None = None
