from pydantic import BaseModel
from decimal import Decimal

class PostCreate(BaseModel):
  title: str
  description: str
  latitude: Decimal
  longitude: Decimal
  user_id: int
