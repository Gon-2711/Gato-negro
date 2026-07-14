> Etiquetas: #ia #bot #gemini

# 📝 Registro de Avances: Integración de Gemini Multimodal (Audio)

**Fecha de los ajustes:** Reciente
**Componente afectado:** `src/bot/bot_core.js`

## 🐛 Problemas Resueltos

1. **Librería Incompatible:** Se intentó usar inicialmente la nueva librería `@google/genai`, la cual causaba errores `404 NOT_FOUND` al apuntar forzosamente a rutas `v1beta`.
   - _Solución:_ Reversión a la librería estable `@google/generative-ai` que ya se usaba en el proyecto.
2. **El Bug de "v11beta":** Al intentar forzar la versión de la API inyectando un objeto `{ apiKey, apiVersion: 'v1' }` al constructor, la librería concatenaba strings erróneamente, creando la ruta fantasma `v11beta` y enviando `[object Object]` como clave, lo que resultaba en un `400 Bad Request`.
   - _Solución:_ Inicialización limpia de la instancia pasándole directamente el String de la llave: `new GoogleGenerativeAI(GEMINI_API_KEY)`.
3. **Error de Sintaxis en Payload de Audio:** Envolver el prompt de texto en un objeto `{ text: "Prompt" }` causaba fallos silenciosos en la versión estable de la librería.
   - _Solución:_ Pasar el texto como un String nativo dentro del Array del payload junto con el `inlineData` del buffer de audio en base64.

## 🚀 Mejoras Implementadas

- **Sistema de Fallback (Respaldo) de Modelos:**
  La transcripción de audio se configuró con un bloque `try-catch`. El sistema intenta primero escuchar usando el modelo ligero y rápido `gemini-1.5-flash`. Si los servidores de Google en la región arrojan un error, el bot es capaz de interceptarlo y cambiar automáticamente al modelo más robusto `gemini-1.5-pro` sin que el usuario lo note, garantizando alta disponibilidad.

## 🧠 Arquitectura de IA Actual

El sistema maneja un enfoque **Híbrido Multimodal**:

1. **Oídos (Nube):** `gemini-1.5-flash` recibe el `.ogg` de Telegram, lo transcribe a texto y lo devuelve. (Bajo costo computacional local).
2. **Cerebro (Local):** `llama3.1` (Ollama) recibe el texto transcrito, analiza el contexto del [[SISTEMA_ERP_Y_BOT|ERP Gato Negro]], determina si debe usar una función (Tool Calling) en [[Supabase]], y redacta la respuesta final.

---

_Nota del Arquitecto:_ Esta arquitectura ahorra el tener que instalar modelos pesados como _Whisper_ en el hardware local, permitiendo que la RTX 4050 se dedique exclusivamente al razonamiento del LLM.
