from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
from .. import models

from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Product])
def read_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@router.post("/", response_model=schemas.Product)
def create_product(
    name_en: str = Form(...),
    name_pl: str = Form(...),
    short_description_en: str = Form(...),
    short_description_pl: str = Form(...),
    full_description_en: str = Form(...),
    full_description_pl: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Zapis produktu w bazie bez ścieżki obrazu
    product_data = schemas.ProductCreate(
        name_en=name_en,
        name_pl=name_pl,
        short_description_en=short_description_en,
        short_description_pl=short_description_pl,
        full_description_en=full_description_en,
        full_description_pl=full_description_pl,
        price=price,
        image=None
    )
    product = crud.create_product(db=db, product=product_data)

    # Generowanie unikalnej nazwy obrazu na podstawie ID produktu
    file_extension = image.filename.split(".")[-1]
    image_filename = f"product_{product.id}.{file_extension}"
    image_path = UPLOAD_DIR / image_filename

    # Zapis zdjęcia na serwerze
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Aktualizacja rekordu produktu o ścieżkę do zdjęcia
    product.image = str(image_filename)
    db.commit()
    db.refresh(product)

    # Zwracamy pełny rekord produktu, w tym zaktualizowane pole `image`
    return product

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/images/{filename}")
def get_image(filename: str):
    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Image not found")
