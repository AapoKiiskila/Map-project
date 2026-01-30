import fastapi
import src.crud.post_crud
import src.database
import decimal
import src.schemas.post_schema
import sqlalchemy.orm

router = fastapi.APIRouter(
  prefix="/posts",
  tags=["Posts"],
)

@router.get("", response_model=list[src.schemas.post_schema.PostFetchAllPosts], status_code=fastapi.status.HTTP_200_OK)
def fetch_all_posts(db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db), id: int | None = None, latitude: decimal.Decimal | None = None, longitude: decimal.Decimal | None = None):
  return src.crud.post_crud.get_all_posts(id, latitude, longitude, db)

@router.get("/{post_id}", response_model=src.schemas.post_schema.PostFetchOnePost, status_code=fastapi.status.HTTP_200_OK)
def fetch_one_post(post_id: int, db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.get_one_post(post_id, db)

@router.post("/create-post", status_code=fastapi.status.HTTP_201_CREATED)
def create_new_post(new_post: src.schemas.post_schema.PostCreate, db: sqlalchemy.orm.Session = fastapi.Depends(src.database.get_db)):
  return src.crud.post_crud.create_post(new_post, db)
