import email
from math import e
from pydantic import BaseModel, EmailStr, conint
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name_en: str
    name_pl: str
    short_description_en: str
    short_description_pl: str
    full_description_en: str
    full_description_pl: str
    price: float
    image: str | None = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    content: str
    rating: Optional[conint(ge=1, le=5)]

class CommentCreate(CommentBase):
    product_id: int

class CommentResponse(CommentBase):
    id: int
    product_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True