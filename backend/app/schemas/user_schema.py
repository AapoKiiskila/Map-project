from pydantic import BaseModel

class UsernameUpdate(BaseModel):
  username: str
