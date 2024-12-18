## **Product Catalogue**

**Opis Projektu**  
Aplikacja katalogu produktów stworzona przy użyciu **React** (frontend) oraz **FastAPI** (backend). Dane są przechowywane w bazie danych **MySQL**. Funkcjonalności:
- Przeglądanie produktów;
- Widok produktu z opisem i komentarzami;
- Dodawanie użytkowników;
- Zarządzanie koszykiem;
- Obsługa 2 języków (angielski i polski) oraz 2 motywów.

### **Technologie użyte w projekcie**
- **Frontend**: React + Vite
- **Backend**: FastAPI
- **Baza danych**: MySQL
- **Konteneryzacja**: Docker & Docker Compose

---

## **Instrukcja uruchomienia**

### **1. Wymagania**
   - Zainstalowany **Docker** i **Docker Compose**.

### **2. Klonowanie repozytorium**
   ```bash
   git clone https://github.com/turek9933/product-catalogue.git
   cd product-catalogue
   ```

### **3. Uruchomienie projektu**
   W głównym katalogu projektu uruchom:
   ```bash
   docker-compose up --build
   ```

### **4. Adresy dostępowe**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Backend**: [http://localhost:8000/](http://localhost:8000/)