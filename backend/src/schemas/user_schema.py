import datetime
import pydantic

class UserInfo(pydantic.BaseModel):
  id: int
  username: str
  email: str

class UserCreate(pydantic.BaseModel):
  username: str
  email: str
  plain_password: str

class UserUpdateUsername(pydantic.BaseModel):
  username: str

class UserUpdatePassword(pydantic.BaseModel):
  password: str

class UserUpdateUsernameResponse(pydantic.BaseModel):
  message: str
  username: str

class UserUpdateEmail(pydantic.BaseModel):
  email: str

class UserUpdateEmailResponse(pydantic.BaseModel):
  message: str
  email: str

class UserReceivedSightings(pydantic.BaseModel):
  title: str
  type: str
  description: str
  id: int
  post_id: int
  user_id: int
  time_created: datetime.datetime
  is_read: int
  username: str

class UserCreatedSightings(pydantic.BaseModel):
  title: str
  description: str
  id: int
  post_id: int
  user_id: int
  time_created: datetime.datetime

class UserUnreadSightingsCount(pydantic.BaseModel):
  count: int
