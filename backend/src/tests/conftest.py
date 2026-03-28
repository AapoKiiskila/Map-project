import fastapi.testclient
import pytest
import src.config
import src.database
import src.main
import src.models
import src.utils
import sqlalchemy
import sqlalchemy.orm

test_engine = sqlalchemy.create_engine(src.config.settings.TEST_DATABASE_URL)
TestingSessionLocal = sqlalchemy.orm.sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_current_user():
  return 1

def override_get_db():
  db = TestingSessionLocal()
  try:
    yield db
  finally:
    db.close()

src.main.app.dependency_overrides[src.utils.get_current_user] = override_get_current_user
src.main.app.dependency_overrides[src.database.get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
  src.database.Base.metadata.create_all(bind=test_engine)
  yield
  src.database.Base.metadata.drop_all(bind=test_engine)

@pytest.fixture()
def client():
  return fastapi.testclient.TestClient(src.main.app)

@pytest.fixture()
def insert_database_data():
  db = TestingSessionLocal()

  try:
    user_1 = src.models.User(
      username = "JohnDoe",
      email = "john.doe@gmail.com",
      hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
    )

    user_2 = src.models.User(
      username = "JaneDoe",
      email = "Jane.Doe@gmail.com",
      hashed_password = "pgtrenuotjko74m27g04786snmvtso5"
    )

    user_1_post_1 = src.models.Post(
      title="Post 1",
      details="Details for post 1",
      type="item",
      latitude=64.67871878251934,
      longitude=24.487784029247916,
      user_id=1
    )

    user_1_post_2 = src.models.Post(
      title="Post 2",
      details="Details for post 2",
      type="item",
      latitude=65.01954070192464,
      longitude=24.74075615288547,
      user_id=1
    )

    user_2_post_1 = src.models.Post(
      title="Post 3",
      details="Details for post 3",
      type="pet",
      latitude=37.49841673428113,
      longitude=14.034985088768552,
      user_id=2
    )

    user_2_post_2 = src.models.Post(
      title="Post 4",
      details="Details for post 4",
      type="item",
      latitude=64.25925591807349,
      longitude=24.840556404570567,
      user_id=2
    )

    user_2_post_3 = src.models.Post(
      title="Post 5",
      details="Details for post 5",
      type="pet",
      latitude=64.22333041783455,
      longitude=27.742000280039008,
      user_id=2
    )

    user_1_sighting_1 = src.models.Sighting(
      description="Description for sighting 1",
      user_id = 1,
      post_id = 3
    )

    user_1_sighting_2 = src.models.Sighting(
      description="Description for sighting 2",
      user_id = 1,
      post_id = 4
    )

    user_2_sighting_1 = src.models.Sighting(
      description="Description for sighting 3",
      user_id = 2,
      post_id = 1
    )

    user_2_sighting_2 = src.models.Sighting(
      description="Description for sighting 4",
      user_id = 2,
      post_id = 2
    )

    db.add_all([
      user_1,
      user_2,
      user_1_post_1,
      user_1_post_2,
      user_2_post_1,
      user_2_post_2,
      user_2_post_3,
      user_1_sighting_1,
      user_1_sighting_2,
      user_2_sighting_1,
      user_2_sighting_2
    ])

    db.commit()
  finally:
    db.close()
