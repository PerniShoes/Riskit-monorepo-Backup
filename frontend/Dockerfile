# Dockerfile dla frontend Node.js
FROM node:20-alpine

WORKDIR /app

# Skopiuj package.json i zainstaluj zależności
COPY package*.json ./
RUN npm ci

# Skopiuj resztę plików
COPY . .

# Zbuduj projekt
RUN npm run build

# Expose port Vite dev server
EXPOSE 5173

# Uruchom dev server (w prod można użyć nginx)
CMD ["npm", "run", "dev", "--", "--host"]