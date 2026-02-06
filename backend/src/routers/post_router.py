import fastapi
import src.crud.post_crud
import src.database
import decimal
import src.schemas.post_schema
import src.utils
import sqlalchemy.orm

router = fastapi.APIRouter(
  prefix="/posts",
  tags=["Posts"],
)

@router.get("", response_model=list[src.schemas.post_schema.PostFetchAllPosts], status_code=fastapi.status.HTTP_200_OK)
def fetch_all_posts(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db), latitude: decimal.Decimal | None = None, longitude: decimal.Decimal | None = None):
  return src.crud.post_crud.get_all_posts(user_id, latitude, longitude, db)

@router.get("/my-posts", response_model=list[src.schemas.post_schema.PostFetchUserPosts], status_code=fastapi.status.HTTP_200_OK)
def fetch_user_posts(user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.get_user_posts(user_id, db)

@router.post("/create-post", status_code=fastapi.status.HTTP_201_CREATED)
def create_new_post(new_post: src.schemas.post_schema.PostCreate, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.create_post(new_post, user_id, db)

@router.get("/{post_id}", response_model=src.schemas.post_schema.PostFetchOnePost, status_code=fastapi.status.HTTP_200_OK)
def fetch_one_post(post_id: int, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.get_one_post(post_id, db)

@router.delete("/{post_id}", status_code=fastapi.status.HTTP_200_OK)
def delete_one_post(post_id: int, user_id: int = fastapi.Depends(src.utils.get_current_user), db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.delete_post(post_id, user_id, db)

