import fastapi
import fastapi.security
import datetime
import jwt
import pwdlib
import src.config
import src.schemas.auth_schema

oauth2_scheme = fastapi.security.OAuth2PasswordBearer(tokenUrl="login")

password_hash = pwdlib.PasswordHash.recommended()

def hash_password(plain_password: str):
  return password_hash.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str):
  return password_hash.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
  to_encode = data.copy()

  if expires_delta:
    expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
  else:
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
    
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, src.config.settings.SECRET_KEY, algorithm=src.config.settings.ALGORITHM)
    
  return encoded_jwt

def verify_access_token(token: str):
  try:
    payload = jwt.decode(token, src.config.settings.SECRET_KEY, algorithms=[src.config.settings.ALGORITHM])
    user_id: str = payload.get("sub")

    if user_id is None:
      raise fastapi.HTTPException(status_code=fastapi.status.HTTP_401_UNAUTHORIZED, detail="Unauthorized", headers={"WWW-Authenticate": "Bearer"})
    
    token_data = src.schemas.auth_schema.TokenData(id=user_id)
  except jwt.PyJWKError:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_401_UNAUTHORIZED, detail="Unauthorized", headers={"WWW-Authenticate": "Bearer"})
  
  return token_data

def get_current_user(token: str = fastapi.Depends(oauth2_scheme)):
  token_data = verify_access_token(token)
  user_id = int(token_data.id)
  
  return user_id
