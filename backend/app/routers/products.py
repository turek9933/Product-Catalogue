from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
from .. import models
from ..utils.minio_client import minio_client
import mimetypes

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
    
    # Przesłanie pliku do MinIO
    minio_client.upload_file(
        file=image.file,
        object_name=image_filename,
        content_type=image.content_type
    )

    # Zapis tylko nazwy pliku w bazie danych
    product.image = image_filename
    db.commit()
    db.refresh(product)

    return product

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/images/{filename}")
def get_image(filename: str):
    try:
        response = minio_client.client.get_object(
            bucket_name=minio_client.bucket_name,
            object_name=filename
        )

        # Rozpoznanie typu MIME
        mime_type, _ = mimetypes.guess_type(filename)
        if not mime_type:
            mime_type = "application/octet-stream"


        return StreamingResponse(
            content=response,
            media_type=mime_type,
            headers={"Content-Disposition": f"inline; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

@router.post("/edit", response_model=schemas.Product)
def edit_product(
    product_id: int = Form(...),
    name_en: str = Form(None),
    name_pl: str = Form(None),
    short_description_en: str = Form(None),
    short_description_pl: str = Form(None),
    full_description_en: str = Form(None),
    full_description_pl: str = Form(None),
    price: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if name_en: product.name_en = name_en
    if name_pl: product.name_pl = name_pl
    if short_description_en: product.short_description_en = short_description_en
    if short_description_pl: product.short_description_pl = short_description_pl
    if full_description_en: product.full_description_en = full_description_en
    if full_description_pl: product.full_description_pl = full_description_pl
    if price is not None: product.price = price

    # Obsługa obrazu, jeśli przesłano nowy
    if image:
        file_extension = image.filename.split(".")[-1]
        image_filename = f"product_{product.id}.{file_extension}"
        image_path = UPLOAD_DIR / image_filename
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        product.image = str(image_filename)
    elif image is None and not product.image:
        raise HTTPException(status_code=400, detail="Image is required")

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", response_model=dict)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.image:
        image_filename = product.image.split("/")[-1]
        minio_client.delete_file(image_filename)

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}