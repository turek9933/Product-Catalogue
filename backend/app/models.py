from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey, DateTime, SmallInteger, func
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(255), nullable=False)
    name_pl = Column(String(255), nullable=False)
    short_description_en = Column(Text, nullable=False)
    short_description_pl = Column(Text, nullable=False)
    full_description_en = Column(Text, nullable=False)
    full_description_pl = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String(255), nullable=True)
    
    comments = relationship("Comment", back_populates="product")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    
    comments = relationship("Comment", back_populates="user")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(SmallInteger, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    product = relationship("Product", back_populates="comments")
    user = relationship("User", back_populates="comments")