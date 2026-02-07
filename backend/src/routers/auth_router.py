import fastapi
import fastapi.security
import src.crud.auth_crud
import src.database
import src.schemas.auth_schema
import sqlalchemy.orm

router = fastapi.APIRouter(
  tags=["Auth"]
)

@router.post("/login", response_model=src.schemas.auth_schema.Token, status_code=fastapi.status.HTTP_200_OK)
def user_login(form_data: fastapi.security.OAuth2PasswordRequestForm = fastapi.Depends(), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.auth_crud.login(form_data, db)
