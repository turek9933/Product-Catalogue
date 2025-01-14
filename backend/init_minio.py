import os
from minio import Minio

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "uploads")

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

if not minio_client.bucket_exists(MINIO_BUCKET_NAME):
    minio_client.make_bucket(MINIO_BUCKET_NAME)

uploads_folder = "app/uploads"
for file_name in os.listdir(uploads_folder):
    file_path = os.path.join(uploads_folder, file_name)
    if os.path.isfile(file_path):
        print(f"Uploading {file_name} to Minio...")
        with open(file_path, "rb") as file_data:
            minio_client.put_object(
                bucket_name=MINIO_BUCKET_NAME,
                object_name=file_name,
                data=file_data,
                length=os.path.getsize(file_path),
                content_type="application/octet-stream"
            )
