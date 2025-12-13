from pydantic import BaseModel
from decimal import Decimal

class PostFetchResponse(BaseModel):
  id: int
  user_id: int
  type: str
  latitude: Decimal
  longitude: Decimal

class PostCreate(BaseModel):
  title: str
  description: str
  type: str
  latitude: Decimal
  longitude: Decimal
  user_id: int
