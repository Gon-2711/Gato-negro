# pendientes #prioridad_alta

📋 Pendientes Técnicos — Gato Negro ERP + BCA Bot

**Última actualización:** 16/05/2026
**Responsable:** Gonzalo Andres Jaimes

> Este archivo consolida TODO lo que falta por hacer, tanto en el ERP como en el Bot,
> separado por prioridad. Actualizar cada vez que se complete o agregue una tarea.

---

## 🔴 URGENTE / Activo (En curso esta semana)

- [x] ~~Bug: `registrar_produccion` no procesaba `abono_pesos`~~ → Resuelto 16/05
- [x] ~~Bug: `recepcion_diaria` solo buscaba estado `pendiente`, Blanca no encontraba registro~~ → Resuelto 16/05
- [x] ~~Bug: Doble consulta anidada al buscar empleado (riesgo de crash)~~ → Resuelto 16/05
- [x] ~~Bug: `esExtra` llegaba como string `"false"` y se evaluaba truthy~~ → Resuelto 16/05
- [x] ~~Bug: Bot no informaba saldo pendiente tras registrar producción~~ → Resuelto 16/05
- [x] ~~Bug: Fabriquín con deuda vieja sin despacho activo esta semana era bloqueado~~ → Modo Pago de Deuda implementado 16/05
- [x] ~~`obtener_color_cesta_para_pregunta` no devolvía cantidad de cestas~~ → Resuelto 16/05

---

## 🟡 PENDIENTE — [[Black Cat Bot (BCB)|Bot BCA]] (Prioridad Alta)

### Historial de conversación persistente
- [ ] El objeto `conversaciones = {}` vive en RAM. Si el contenedor Docker se reinicia, el bot olvida todo el contexto de cada chat.
- **Solución:** Guardar el historial en [[Supabase]] (tabla `bot_conversaciones`) con TTL de 24h o limitar a 20 mensajes como hoy pero persistidos en DB.
- **Impacto:** Cuando el bot se mueva a la nube, esto es obligatorio.

### Modo nube (cuando haya PC dedicada o API de IA estable)
- [ ] Migrar el cerebro LLM de **Ollama → Gemini API** para el despliegue en Vercel.
  - Condición bloqueante: Gemini API free tier se satura frecuentemente. Esperar a que haya cuota pagada o API alternativa estable.
  - El código ya detecta `VERCEL === '1'` → solo falta el switch de LLM.
- [ ] Historial de conversación en [[Supabase]] (requerido antes del paso anterior).
- [ ] **PC dedicada 24/7:** Dejar un equipo corriendo Docker + Ollama permanentemente para que el bot no dependa de la PC de desarrollo. Esto es la solución más inmediata y práctica.

### Soporte de audios en el bot
- [ ] **El bot NO puede procesar mensajes de voz todavía.** Si alguien le manda un audio por Telegram, el bot no lo entiende ni responde.
  - **Contexto:** Ya existe integración con **Gemini API para transcripción de audio** en `bot_core.js` (`registro_avances_gemini_audio.md`), pero no está conectada al flujo principal de mensajes.
  - **Lo que falta:** Detectar cuando el `message.voice` llega, descargar el OGG de Telegram, enviarlo a Gemini para transcripción y pasar el texto resultante al flujo normal de Ollama como si el usuario lo hubiera escrito.
  - **Bloqueo actual:** Gemini API free tier se satura. Cuando haya cuota estable, este es el siguiente paso del bot.

### Mejoras al flujo de registro de producción
- [ ] Validar que cuando el bot dice "5000 tabacos", el LLM no confunda entre tabacos normales y extras. Monitorear en producción con Blanca y otros fabriquines.
- [ ] Testear el cálculo de **cestas pendientes** con fabriquines que han hecho múltiples entregas parciales — verificar que la suma histórica de `recepcion_diaria` cuadra con el `cestas_cant` del despacho.
- [ ] Agregar herramienta `consultar_saldo_completo` para que el bot pueda responder "¿cuánto le debo a Blanca?" o "¿qué queda pendiente?" sin necesidad de registrar producción.

### Robustez del modelo
- [ ] Evaluar **Qwen 2.5 (7B)** como alternativa a Llama 3.1 si los problemas de alucinaciones persisten. Según la documentación interna ya se rankeó como "Plan B" sólido.
- [ ] Crear batería de pruebas manuales en Telegram con casos extremos:
  - Fabriquín con nombre ambiguo (ej: "José" cuando hay dos)
  - Registro con 0 tabacos y solo pesos
  - Abono que supera la deuda total

---

## 🟡 PENDIENTE — ERP Web (Prioridad Media)

### Módulos faltantes (según hoja de ruta del semillero)
- [ ] **[[Módulo Anilladores]] completo:** CRUD para asignar tabacos a anilladores, registrar cestas anilladas y liquidar pago. (Hay una vista parcial en `operario.js` pero no está terminada).
- [ ] **Módulo Envolvedoras:** Similar al de anilladores. Recepcionan tabaco anillado, registran vitola y celofán. Sub-inventarios: Papel Timbrado, Cajas Unitarias, Cajas Máster.
- [ ] **Control de Calidad / Merma Formal:** Botón para dar de baja tabacos partidos o podridos y que el inventario cuadre al 100%.

### Mejoras técnicas
- [ ] **Auditoría completa (log de cambios):** Si falta 1 Kg, hoy hay que buscarlo archivo por archivo. Crear tabla `audit_log` con: `[FECHA] [USUARIO_ID] [ACCION] [TABLA] [ANTES] [DESPUES]`.
- [ ] **Migrar operaciones pesadas a RPC de Supabase:** Algunos cálculos en `recepcion.ejs` hacen matemática en el cliente. Mover a Stored Procedures para velocidad.
- [ ] **Responsive / Tablet-friendly:** La UI se ve excelente en escritorio, pero botones de despacho son densos en tablet. Ajustar breakpoints críticos.
- [ ] **PWA / Offline-First:** Configurar ServiceWorkers + IndexedDB para que el ERP funcione aunque caiga el internet de la fábrica. (Prioridad semillero).
- [ ] **Login — Ojito para ver contraseña:** Añadir botón toggle (ícono ojo 👁️) en el campo de contraseña del login para mostrar/ocultar el texto. Mejora básica de UX.

### Módulo Recepción — Vista enriquecida
- [ ] **Mostrar tabacos pendientes por fabriquín:** En la tabla de recepción diaria, agregar una columna o badge visible que muestre cuántos tabacos le faltan por entregar a cada fabriquín en la semana (diferencia entre lo despachado y lo recibido hasta ahora).
- [ ] **Mostrar cestas pendientes y su color:** En la misma vista, mostrar cuántas cestas le faltan por devolver y de qué color son (consultar `despachos_registro.cestas_cant` y `color_cesta`, restar lo ya devuelto en los `_cestas` del día). Esto evita tener que preguntarle al bot o buscar en otra pantalla.

### Módulo Mantenimiento — Flujo de tareas y correctivos
- [ ] **Admin asigna tareas de mantenimiento:** El administrador debe poder crear tareas desde la plataforma indicando: máquina, tipo (preventivo / limpieza post-producción / revisión), fecha límite y responsable (mecánico). El mecánico ve su lista de tareas pendientes al entrar.
- [ ] **Mecánico solicita correctivo:** El mecánico debe poder abrir una solicitud desde la plataforma diciendo "La máquina X necesita un correctivo" con descripción del problema. Esa solicitud queda en estado `pendiente_aprobacion`.
- [ ] **Admin aprueba o rechaza el correctivo:** El admin recibe la solicitud, la revisa y la aprueba (cambia a `aprobado`) o la rechaza con un comentario. Solo cuando está aprobada el mecánico puede ejecutarla y registrarla formalmente.
- [ ] **Notificación al admin (deseable):** Cuando el mecánico envía una solicitud, que le llegue al admin por Telegram vía BCA: *"🔧 Solicitud de correctivo: [Máquina] — [Descripción]. ¿Apruebas?"*
  - Tablas nuevas necesarias: `tareas_mantenimiento` (admin → mecánico) y `solicitudes_correctivo` (mecánico → admin con estado de aprobación).

### Panel de Gerencia
- [ ] **Dashboard KPI ejecutivo:** Una sola pantalla con: tabacos rolados hoy, top deudores, stock crítico de cestas, próximos mantenimientos de máquinas. (Existe `Chart.js` ya integrado, falta la vista).

---

## 🟢 PENDIENTE — Investigación / Semillero (Prioridad Académica)

- [ ] **Estudio comparativo Pre vs Post ERP:** Recopilar tiempos con Anubis/Excel (meses anteriores) vs tiempos con el ERP nuevo. Tabular KPIs para el artículo.
- [ ] **Redactar Artículo Científico:** Extraer de `INFORME_FINAL_GATO_NEGRO.md` para formato paper (introducción, metodología, resultados, conclusiones).
- [ ] **Video demostrativo:** Grabar screencast del flujo completo: despacho → recepción → nómina → bot BCA registrando producción. Para presentación del semillero.
- [ ] Actualizar porcentaje de avance en `ESTADO_AVANCE_SEMILLERO.md` (actualmente marcado en ~65%, pero el bot ya avanzó bastante más).

---

## 💡 IDEAS FUTURAS (Sin fecha, para considerar)

- **Arquitectura híbrida básica en Vercel:** Subir solo el receptor de Telegram (sin IA) para tener comandos básicos funcionando 24/7 sin depender de la PC. El bot conversacional seguiría en local.
- **Alertas proactivas:** El bot podría enviar mensajes automáticos a Gonzalo cuando una máquina tiene mantenimiento vencido o cuando el stock de cestas baja de X unidades.
- **Multi-agente BCB:** Ver [[VISION_MULTIAGENTE_BCB]] — la visión de tener agentes especializados (Agente Inventario, Agente Nómina, Agente Mantenimiento).

---

## 🧠 FASE FUTURA — Predicciones con Inteligencia Artificial (Redes Neuronales)

> **Condición de entrada:** Esta fase solo puede comenzar cuando el ERP tenga suficientes datos reales acumulados (mínimo 6–12 meses de operación continua registrada en Supabase). Sin datos de calidad, cualquier modelo entrenado será ruido.

### 📊 Qué se quiere predecir

- [ ] **Predicción de demanda / pedidos:** Con base en el historial de tabacos producidos y despachados a mayoristas, predecir cuántos tabacos se necesitarán la próxima semana/mes. Ayuda a planear el despacho de materia prima a tiempo.
- [ ] **Proyección de ganancias:** Cruzando producción histórica, precios de venta y nómina, proyectar la utilidad esperada del siguiente periodo.
- [ ] **Detección de fabriquines en riesgo de rezago:** Identificar patrones tempranos de fabriquines que históricamente se atrasan — para anticiparse antes de que la deuda crezca.
- [ ] **Predicción de mantenimientos:** Con base en el historial de averías por máquina, estimar cuándo es probable que una máquina falle y programar mantenimiento preventivo antes.
- [ ] **Optimización de inventario de insumos:** Predecir cuándo se acabará la capa, capote, cestas, etc. para hacer pedidos con tiempo.

### 🔬 Plan técnico (cuando llegue el momento)

1. **Extraer datos históricos de Supabase** en formato CSV / DataFrame (Python + `pandas`).
2. **Limpiar y normalizar** los datos (fechas, cantidades, empleados).
3. **Elegir arquitecturas de red** según el tipo de predicción:
   - Series de tiempo (producción, ganancias): **LSTM** o **Transformer temporal**
   - Clasificación (riesgo de rezago): **Red Neuronal Densa (MLP)** o **Random Forest** como baseline
   - Mantenimiento predictivo: **Regresión + Análisis de supervivencia**
4. **Entrenar modelos** en Python (TensorFlow / PyTorch).
5. **Exponer como API** (FastAPI) y conectar al Dashboard del ERP para mostrar las predicciones en tiempo real.
6. **Mostrar en el Dashboard KPI** junto con los datos actuales: *“Producción proyectada próxima semana: 45.000 tabacos”*.

> **Nota:** Los datos ya se están guardando correctamente en Supabase desde la V3.0. Cada movimiento, nómina, despacho y registro de fabriquín es material de entrenamiento futuro. El ERP ya está sembrando los datos que las redes neurales necesitarán.

---

## 📁 Archivos clave de referencia

| Archivo | Contenido |
|---|---|
| `registro_bugfix_ollama.md` | Log de todos los bugs corregidos en el bot (10 bugs al 16/05) | Ver [[registro_bugfix_ollama]] |
| `ESTADO_AVANCE_SEMILLERO.md` | Desglose % por fase del semillero |
| `informe_estado_v3.0.md` | Estado de módulos del ERP |
| `avance_08_05.md` | Documentación de la contenerización con Docker |
| `conversation sobre ollama` | Ranking de modelos LLM y arquitectura del bot |
| `VISION_MULTIAGENTE_BCB.md` | Visión futura multi-agente |

---

_Gonzalo Andres Jaimes — Proyecto Semillero Robolab / Gato Negro ERP_
