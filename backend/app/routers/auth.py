import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

from ..database import SessionLocal
from ..models import User
from ..schemas import Token, UserCreate, UserPasswordResetRequest, UserPasswordReset, UserProfileUpdate, UserPasswordUpdate, UserAccountDelete
from .. import crud

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
SECRET_KEY = os.getenv("SECRET_KEY", "SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RESET_TOKEN_EXPIRE_MINUTES = 15
DELETED_USER_USERNAME = os.getenv("DELETED_USER_USERNAME", "deleted")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    db_user = crud.create_user(db, user)
    return {"username": db_user.username, "email": db_user.email, "role": db_user.role}

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": user.username, "role": user.role, "exp": datetime.utcnow() + access_token_expires},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_admin_user(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return user

@router.post("/reset-password-request/")
def reset_password_request(user_data: UserPasswordResetRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    token = jwt.encode(
        {"sub": str(user.id), "exp": datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    
    # TODO
    # Tymczasowe wypisywanie linku w terminalu, można zaimplementować wysyłanie mailem
    print(f"Password reset link: {reset_link}")
    
    return {"msg": "Password reset link sent to email", "reset_link": reset_link}

@router.post("/reset-password/")
def reset_password(data: UserPasswordReset, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.JWTError as e:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crud.update_user_password(db, user, data.new_password)
    return {"msg": "Password has been reset"}


@router.post("/update-profile/")
def update_profile(user_data: UserProfileUpdate, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not crud.verify_password(user_data.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    if user_data.new_email:
        existing_user = crud.get_user_by_email(db, user_data.new_email)
        if existing_user and existing_user.id != user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    crud.update_user_profile(db, user, user_data.new_email, user_data.new_username)
    return {"msg": "Profile updated successfully"}

@router.post("/update-password/")
def update_password(user_data: UserPasswordUpdate, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not crud.verify_password(user_data.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    crud.update_user_password(db, user, user_data.new_password)
    return {"msg": "Password updated successfully"}

@router.post("/delete-account/")
def delete_account(user_data: UserAccountDelete, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not crud.verify_password(user_data.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    deleted_user = db.query(User).filter(User.username == DELETED_USER_USERNAME).first()
    if not deleted_user:
        raise HTTPException(status_code=500, detail="Deleted User account not found")
    
    crud.reassign_user_comments(db, user.id, deleted_user.id)
    crud.delete_user(db, user)
    return {"msg": "Account deleted successfully"}
