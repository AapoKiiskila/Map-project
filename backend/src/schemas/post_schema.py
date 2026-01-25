import datetime
import decimal
import pydantic

class PostFetchAllPosts(pydantic.BaseModel):
  id: int
  user_id: int
  type: str
  latitude: decimal.Decimal
  longitude: decimal.Decimal

class PostFetchOnePost(pydantic.BaseModel):
  title: str
  details: str
  time_created: datetime.datetime
  time_updated: datetime.datetime
  user_id: int

class PostCreate(pydantic.BaseModel):
  title: str
  details: str
  type: str
  latitude: decimal.Decimal
  longitude: decimal.Decimal
  user_id: int

class PostFetchUserPosts(pydantic.BaseModel):
  id: int
  title: str
  type: str
  time_created: datetime.datetime

class PostUpdate(pydantic.BaseModel):
  title: str | None = None
  details: str | None = None
  type: str | None = None
