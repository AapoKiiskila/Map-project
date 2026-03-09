import fastapi.testclient
import pytest
import src.config
import src.database
import src.main
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

@pytest.fixture(scope="function", autouse=True)
def setup_database():
  src.database.Base.metadata.create_all(bind=test_engine)
  yield
  src.database.Base.metadata.drop_all(bind=test_engine)

@pytest.fixture()
def client():
  return fastapi.testclient.TestClient(src.main.app)

@pytest.fixture()
def db():
  db = TestingSessionLocal()
  try:
    yield db
  finally:
    db.close()
