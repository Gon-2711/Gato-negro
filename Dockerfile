# 1. Usar una imagen oficial de Node.js ligera (Alpine)
FROM node:20-alpine

# 2. Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiar los archivos de dependencias
COPY package*.json ./

# 4. Instalar las dependencias (solo las necesarias para producción)
RUN npm ci --only=production

# 5. Copiar el resto del código del proyecto al contenedor
COPY . .

# 6. Variables de entorno por defecto (se sobrescriben al ejecutar)
ENV NODE_ENV=production
ENV OLLAMA_HOST=http://host.docker.internal:11434

# 7. Comando para iniciar tu servidor
CMD ["node", "server.js"]