# Usa una imagen base de Node.js
FROM node:18

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo de paquete y el archivo de bloqueo (package.json y package-lock.json)
COPY package*.json ./

# Instala todas las dependencias de la aplicación (incluidas devDependencies)
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Compila el proyecto
RUN npm run build

# Instala las dependencias necesarias para Puppeteer y Chromium
RUN apt-get update && apt-get install -y \
  wget \
  gnupg2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-glib-1-2 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxrandr2 \
  libxss1 \
  libxtst6 \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libxshmfence1 \
  libgtk-3-0 \
  chromium \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Establece el PATH para que Puppeteer encuentre Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium

# Expone el puerto en el que tu aplicación escucha (ajusta según sea necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
