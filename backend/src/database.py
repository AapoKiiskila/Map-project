import src.config
import sqlalchemy
import sqlalchemy.ext.declarative
import sqlalchemy.orm

engine = sqlalchemy.create_engine(src.config.settings.DATABASE_URL)
SessionLocal = sqlalchemy.orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = sqlalchemy.ext.declarative.declarative_base()

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
