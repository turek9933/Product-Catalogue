import email
from operator import ne
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

def get_products(db: Session):
    return db.query(models.Product).all()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name_en=product.name_en,
        name_pl=product.name_pl,
        short_description_en=product.short_description_en,
        short_description_pl=product.short_description_pl,
        full_description_en=product.full_description_en,
        full_description_pl=product.full_description_pl,
        price=product.price,
        image=product.image  # Użycie istniejącego pola do zapisu ścieżki
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def create_user(db: Session, user: schemas.UserCreate, role: str = "user"):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str):
    return pwd_context.hash(password)

def update_user_password(db: Session, user: models.User, new_password: str):
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

def update_user_profile(db: Session, user: models.User, new_email: str = None, new_username: str = None):
    if new_email:
        user.email = new_email
    if new_username:
        user.username = new_username
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user: models.User):
    db.delete(user)
    db.commit()

def reassign_user_comments(db: Session, user_id: int, new_user_id: int):
    db.query(models.Comment).filter(models.Comment.user_id == user_id).update({"user_id": new_user_id})
    db.commit()