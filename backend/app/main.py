import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, auth, comments

FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app = FastAPI()

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(comments.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_URLS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"], 
)
