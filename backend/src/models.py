import src.database
import sqlalchemy
import sqlalchemy.orm

class User(src.database.Base):
  __tablename__ = "users"

  id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
  username = sqlalchemy.Column(sqlalchemy.String(50), nullable=False, unique=True)
  email = sqlalchemy.Column(sqlalchemy.String(50), nullable=False, unique=True)
  hashed_password = sqlalchemy.Column(sqlalchemy.String(255), nullable=False)

  posts = sqlalchemy.orm.relationship("Post", back_populates="user", cascade="all, delete")
  sightings = sqlalchemy.orm.relationship("Sighting", back_populates="user", cascade="all, delete")

class Post(src.database.Base):
  __tablename__ = "posts"

  id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
  title = sqlalchemy.Column(sqlalchemy.String(50), nullable=False)
  details = sqlalchemy.Column(sqlalchemy.String(500), nullable=False)
  type = sqlalchemy.Column(sqlalchemy.String(6), nullable=False)
  latitude = sqlalchemy.Column(sqlalchemy.DECIMAL(18, 15), nullable=False)
  longitude = sqlalchemy.Column(sqlalchemy.DECIMAL(18, 15), nullable=False)
  time_created = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, server_default=sqlalchemy.func.UTC_TIMESTAMP())
  time_updated = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, server_default=sqlalchemy.func.UTC_TIMESTAMP(), onupdate=sqlalchemy.func.UTC_TIMESTAMP())

  user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id", ondelete="CASCADE"))
  user = sqlalchemy.orm.relationship("User", back_populates="posts")

  sightings = sqlalchemy.orm.relationship("Sighting", back_populates="post", cascade="all, delete")

class Sighting(src.database.Base):
  __tablename__ = "sightings"

  id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
  description = sqlalchemy.Column(sqlalchemy.String(500), nullable=False)
  is_read = sqlalchemy.Column(sqlalchemy.Boolean, server_default=sqlalchemy.sql.expression.false(), nullable=False)
  time_created = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, server_default=sqlalchemy.func.UTC_TIMESTAMP())

  user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id", ondelete="CASCADE"))
  user = sqlalchemy.orm.relationship("User", back_populates="sightings")

  post_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("posts.id", ondelete="CASCADE"))
  post = sqlalchemy.orm.relationship("Post", back_populates="sightings")
  