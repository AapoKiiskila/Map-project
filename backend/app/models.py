from app.database import Base
from sqlalchemy import Column, DECIMAL, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True)
  username = Column(String(50), nullable=False, unique=True)
  email = Column(String(50), nullable=False, unique=True)
  hashed_password = Column(String(255), nullable=False)

  posts = relationship("Post", back_populates="user", cascade="all, delete")

class Post(Base):
  __tablename__ = "posts"

  id = Column(Integer, primary_key=True)
  title = Column(String(50), nullable=False)
  description = Column(String(500), nullable=False)
  type = Column(String(6), nullable=False)
  latitude = Column(DECIMAL(18, 15), nullable=False)
  longitude = Column(DECIMAL(18, 15), nullable=False)

  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
  user = relationship("User", back_populates="posts")
  