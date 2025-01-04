FROM node:20

WORKDIR /app

# Instalacja zależności
COPY package.json package-lock.json ./
RUN npm install

# Kopiowanie kodu aplikacji
COPY ./ ./ 

# Uruchomienie serwera deweloperskiego
CMD ["npm", "run", "dev"]
