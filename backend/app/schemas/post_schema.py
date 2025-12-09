from pydantic import BaseModel
from decimal import Decimal

class PostCreate(BaseModel):
  title: str
  description: str
  type: str
  latitude: Decimal
  longitude: Decimal
  id: int
