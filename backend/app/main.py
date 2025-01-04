import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, auth, comments

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

app = FastAPI()

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(comments.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"], 
)
