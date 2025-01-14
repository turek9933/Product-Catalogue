import os
from minio import Minio

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "uploads")

class MinioClient:
    def __init__(self, endpoint, access_key, secret_key, bucket_name):
        self.client = Minio(
            endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=False
        )
        self.bucket_name = bucket_name
        # Tworzenie bucketu, jeśli nie istnieje
        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)

    def upload_file(self, file, object_name, content_type):
        self.client.put_object(
            bucket_name=self.bucket_name,
            object_name=object_name,
            data=file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=content_type
        )
        return f"http://{MINIO_ENDPOINT}/{self.bucket_name}/{object_name}"

    def delete_file(self, object_name):
        self.client.remove_object(self.bucket_name, object_name)

minio_client = MinioClient(
    endpoint=MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    bucket_name=MINIO_BUCKET_NAME
)