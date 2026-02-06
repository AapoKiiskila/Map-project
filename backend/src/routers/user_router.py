import fastapi
import src.crud.user_crud
import src.database
import src.schemas.user_schema
import src.utils
import sqlalchemy.orm

router = fastapi.APIRouter(
  prefix="/users",
  tags=["Users"],
)

@router.post("", status_code=fastapi.status.HTTP_201_CREATED)
def create_new_user(new_user: src.schemas.user_schema.UserCreate, db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.user_crud.create_user(new_user, db)

@router.get("", response_model=src.schemas.user_schema.UserInfo, status_code=fastapi.status.HTTP_200_OK)
def get_user_info(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.user_crud.get_user(user_id, db)

@router.put("/update-username", response_model=src.schemas.user_schema.UserUpdateUsernameResponse, status_code=fastapi.status.HTTP_200_OK)
def change_new_username(new_username: src.schemas.user_schema.UserUpdateUsername, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.user_crud.change_username(user_id, new_username, db)

@router.put("/update-email", response_model=src.schemas.user_schema.UserUpdateEmailResponse, status_code=fastapi.status.HTTP_200_OK)
def change_new_email(new_email: src.schemas.user_schema.UserUpdateEmail, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.user_crud.change_email(user_id, new_email, db)
