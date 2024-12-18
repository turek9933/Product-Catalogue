import email
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