FROM python:3.11

WORKDIR /app

# Kopiowanie zależności i instalacja
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiowanie skryptu do inicjalizacji Minio
COPY init_minio.py /app/init_minio.py

# Kopiowanie kodu aplikacji
COPY app ./app

# Uruchamianie skryptu przy starcie kontenera
CMD ["sh", "-c", "python /app/init_minio.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
