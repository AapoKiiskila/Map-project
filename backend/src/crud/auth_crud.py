import datetime
import fastapi
import fastapi.security
import src.config
import src.models
import src.schemas.auth_schema
import src.utils
import sqlalchemy.orm

def login(form_data: fastapi.security.OAuth2PasswordRequestForm, db: sqlalchemy.orm.Session):
  user = db.query(src.models.User).filter(src.models.User.username == form_data.username).first()

  if not user:
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
 
  if not src.utils.verify_password(form_data.password, user.hashed_password):
    raise fastapi.HTTPException(status_code=fastapi.status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
  
  access_token_expires = datetime.timedelta(minutes=src.config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
  user_access_token = src.utils.create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)

  token = src.schemas.auth_schema.Token(
    access_token=user_access_token,
    token_type="bearer"
  )

  return token
