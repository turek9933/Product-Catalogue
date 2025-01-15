## **Product Catalogue**

## **Spis treści**
1. [Opis Projektu](#opis-projektu)
2. [Technologie użyte w projekcie](#technologie-użyte-w-projekcie)
3. [Instrukcja uruchomienia](#instrukcja-uruchomienia)
   1. [Wymagania](#1-wymagania)
   2. [Klonowanie repozytorium](#2-klonowanie-repozytorium)
   3. [Uruchomienie projektu](#3-uruchomienie-projektu)
   4. [Adresy dostępowe](#4-adresy-dostępowe)
4. [Struktura projektu](#struktura-projektu)
5. [Dodatkowe informacje](#dodatkowe-informacje)
   1. [Symulacja płatności PayPal](#symulacja-płatności-paypal)
   2. [Uzyskanie dostępu do backendu lub bazy danych](#uzyskanie-dostępu-do-backendu-lub-bazy-danych)
   2. [Reset hasła użytkownika](#reset-hasła-użytkownika)

**Opis Projektu**  
Aplikacja katalogu produktów stworzona przy użyciu **React** (frontend) oraz **FastAPI** (backend). Dane są przechowywane w bazie danych **MySQL** oraz w serwerze **MinIO**. Funkcjonalności:
- Zarządzanie użytkownikami;
- Przeglądanie i edycja produktów;
- Dodawania i usuwanie komentarzy;
- Zarządzanie koszykiem i składanie zamówień;
- Obsługa języków (angielski i polski) oraz motywów (jasny i ciemny).


### **Technologie użyte w projekcie**
- **Frontend**: React + Vite
- **Backend**: FastAPI
- **Baza danych**: MySQL
- **Konteneryzacja**: Docker
- **Przechowywanie plików**: MinIO

---

## **Instrukcja uruchomienia**

### **1. Wymagania**
   - Zainstalowany [**Docker**](https://www.docker.com) i [**Docker Compose**](https://docs.docker.com/compose/install/).

### **2. Klonowanie repozytorium**
   ```bash
   git clone https://github.com/turek9933/product-catalogue.git
   cd product-catalogue
   ```

### **3. Uruchomienie projektu**
   Uruchom Dockera. W głównym katalogu projektu uruchom:
   ```bash
   docker-compose up --build
   ```

### **4. Adresy dostępowe**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Swagger (dokumentacja API)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## **Struktura projektu**

- **/frontend**: Kod źródłowy frontendu.
- **/backend**: Kod źródłowy backendu.
- **/db**: Pliki inicjalizacyjne bazy danych.
- **/minio**: Pliki inicjalizacyjne serwera plików.
- **docker-compose.yml**: Konfiguracja Dockera dla wszystkich serwisów.

---

## **Dodatkowe informacje**

### **Symulacja płatności PayPal**
Aplikacja wykorzystuje środowisko sandbox PayPal do obsługi symulacji płatności. Niestety **do uzyskania tej funkcjonalności niezbędny jest Client ID uzyskiwany z serwisu deweloperskiego PayPal**. Aby skonfigurować PayPal, wykonaj następujące kroki:

1. **Utwórz konto PayPal Developer**:
   - Zarejestruj się na stronie [PayPal Developer](https://developer.paypal.com/). (Mail oraz nr telefonu należy podać faktyczny, ale dane bankowe nie są wymagane.)
   - Zaloguj się i utwórz aplikację w sekcji "My Apps & Credentials".

2. **Uzyskaj dane uwierzytelniające sandbox**:
   - Skopiuj `Client ID` swojej aplikacji sandbox.

3. **Dodaj dane do konfiguracji Dockera**:
   - W pliku `docker-compose.yml`, w sekcji `frontend`, zaktualizuj zmienną `VITE_PAYPAL_CLIENT_ID`:
     ```yaml
     environment:
       VITE_PAYPAL_CLIENT_ID: "PAYPAL_CLIENT_ID"
     ```

4. **Testowanie płatności**:
   - Uruchom aplikację ponownie i zrealizuj płatność w symulowanym środowisku PayPal sandbox.

5. **Weryfikacja płatności**:
   - Płatności można zweryfikować w sekcji "Sandbox > Transactions" w panelu PayPal Developer.


### **Uzyskanie dostępu do backendu lub bazy danych?**
Aby uzyskać dostęp do backendu lub bazy danych, odkomentuj sekcję `ports` w pliku `docker-compose.yml` i uruchom ponownie kontenery.

Przykład odkomentowania dla MinIO:
```yaml
    # ports:
    #   - "9000:9000"
    #   - "9001:9001"
```
```yaml
    ports:
      - "9000:9000"
      - "9001:9001"
```
### **Reset hasła użytkownika**
Aby zresetować hasło generowany jest link. Nie jest on wysyłany bezpośrednio na adres mailowy użytkownika. Aplikacja tylko symuluje generowanie takiego linka oraz wypisuje go w terminalu. Można znaleźć link w logach Dockera - kontener backend. Pojawi się on również w terminalu w przypadku uruchomienia projektu komendą ```docker-compose up --build```. Link może wyglądać np. następująco:
```bash
Password reset link: http://localhost:3000/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiZXhwIjoxNzM2OTUwNjk5fQ.4lZsUgfv4UuOgPVeHP2w2WK78KtimYT7_NSq0JeG7iU
   ```
