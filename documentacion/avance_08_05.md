> Etiquetas: #ia #bot #docker

# 📝 Avance del Día: 08/05 - Contenerización (Docker)

**Objetivo del día:** Empaquetar el [[Black Cat Bot (BCB)|Bot de Telegram]] (Node.js) para preparar su eventual despliegue en la nube (DigitalOcean/Azure) o estandarizar su ejecución local, separando el ecosistema de IA local.

## 🛠️ Lo que se hizo hoy

1. **Adaptación de `bot_core.js` para red virtual:**
   - Se modificó la instanciación de Ollama. Ya no apunta a un `localhost` estático, sino a la variable de entorno dinámico `OLLAMA_HOST`.
   - _Razón:_ Dentro de un contenedor Docker, `localhost` es el propio contenedor. Para hablar con la PC (donde corre Llama 3.1), necesitaba configurarse dinámicamente.

2. **Creación del `Dockerfile`:**
   - Se configuró la imagen base `node:20-alpine` (ligera y segura).
   - Se establecieron comandos para copiar `package.json`, instalar dependencias y ejecutar `server.js`.
   - Se inyectó por defecto el entorno `http://host.docker.internal:11434` para permitir que el contenedor Docker perfore su aislamiento y se comunique con la RTX 4050 / Ollama de Windows.

3. **Creación de `.dockerignore`:**
   - Se bloquearon carpetas como `node_modules` y `documentacion` para que el contenedor final sea liviano y se construya rápido.

4. **Creación de `docker-compose.yml`:**
   - Se configuró un orquestador básico para inicializar el contenedor con el nombre `bcb-bot-container`.
   - Se configuró el pase automático del archivo `.env` al contenedor para garantizar la persistencia del Token de Telegram y la API Key de Gemini.

5. **Ajustes finales para accesibilidad del ERP en Docker:**
   - Se modificó `server.js` para que el servidor Express (`app.listen`) inicie basado en la variable `VERCEL` y no en `NODE_ENV`. Esto permite que el [[SISTEMA_ERP_Y_BOT|ERP]] corra el dashboard web en modo producción dentro de Docker sin apagarse.
   - Se mapeó el puerto `3000:3000` en `docker-compose.yml` para poder acceder al sistema web desde el navegador del host Windows.

## 🚧 Pendientes (Troubleshooting)

- **Requisito del sistema:** Windows requiere que _Docker Desktop_ esté instalado y ejecutándose en segundo plano antes de poder interpretar el comando `docker compose`.
- Se debe reiniciar la terminal de PowerShell posterior a la instalación para recargar el PATH.
- **La Trampa de VS Code:** Si se usa la terminal integrada de VS Code tras instalar Docker, no basta con cerrarla o limpiarla. Hay que "matar" el proceso (icono de la papelera) y abrir una terminal nueva, o de lo contrario no reconocerá el comando `docker`.

## 📦 Notas de Instalación de Docker en Windows

- Se realizó la instalación de **Docker Desktop** mediante la terminal usando Windows Package Manager (`winget install Docker.DockerDesktop`).
- **Paso crítico:** Es obligatorio reiniciar el equipo tras la instalación para que Windows inyecte Docker en el `PATH` y el comando sea reconocido globalmente por PowerShell y VS Code.
- **Despliegue Exitoso:** Se ejecutó `docker compose up -d --build` logrando la contenerización completa del bot y el ERP web. Ambos sistemas conviven y funcionan perfectamente en el contenedor aislado `bcb-bot-container`, mapeando el puerto 3000 local.

## 🧹 Optimizaciones Menores

- Se eliminó la etiqueta `version: "3.8"` del archivo `docker-compose.yml` para evitar el warning de obsolescencia del motor moderno de Docker (`the attribute version is obsolete`).
