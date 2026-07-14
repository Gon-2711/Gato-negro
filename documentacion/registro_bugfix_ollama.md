> Etiquetas: #ia #bot #ollama

# 🐛 Registro de Bugfixes: Ollama Tool Calling — [[Black Cat Bot (BCB)|Bot Gato Negro (BCA)]]

**Fecha:** 16/05/2026
**Componente afectado:** `src/bot/bot_core.js`
**Modelo LLM:** Llama 3.1 8B (vía [[VISION_MULTIAGENTE_BCB|Ollama local]])

---

## 🐛 Problemas Reportados y Solucionados

### Bug 1 — Alucinación de Tool Calls (sintaxis Python en JSON)
**Síntoma:** El modelo imprimía en el chat el JSON de la herramienta en lugar de invocarla nativamente. Usaba `False` (Python) en lugar de `false` (JSON estándar), lo que rompía el parseador.

**Causa raíz:** Llama 3.1 8B no siempre usa el canal nativo de `tool_calls`; a veces "escupe" la estructura como texto plano en el mensaje.

**Solución:** Se implementó un interceptador RegEx en `responderConOllama()` que:
1. Detecta si el mensaje contiene `"name"` y `{`.
2. Extrae el JSON, reemplaza `False/True` por `false/true`.
3. Inyecta el resultado en `response.message.tool_calls` para forzar el flujo correcto.

---

### Bug 2 — Filtro Anti-Alucinación demasiado agresivo
**Síntoma:** El filtro bloqueaba cualquier mensaje con `{` o `}`, incluyendo respuestas legítimas del modelo.

**Solución:** Filtro suavizado para interceptar solo strings específicos como `{"name":` y `{"function":`, preservando respuestas normales que puedan contener corchetes.

---

### Bug 3 — Herramienta `registrar_produccion` sin parámetro `abono_pesos`
**Síntoma:** Cuando el usuario decía "abonó $25.000 pesos", el modelo no sabía dónde meter ese dato. El parámetro no existía ni en la función ni en el schema de la herramienta.

**Solución:**
- Añadido `abono_pesos = 0` como parámetro en `registrarProduccionRapida()`.
- Añadido `abono_pesos` al schema de `herramientasOllama` con descripción clara.
- Lógica de descuento en cascada: itera los préstamos activos en `prestamos_fabriquines` ordenados por `created_at ASC` y descuenta hasta agotar el abono o liquidar el préstamo (`estado: 'pagado'`).

---

### Bug 4 — Tipos de datos String vs Integer
**Síntoma:** Llama 3.1 pasaba `"tabacos":"5000"` (string) en lugar de `5000` (integer). JavaScript concatenaba en vez de sumar: `10 + "5000" = "105000"`.

**Solución:** Casteo obligatorio con `parseInt()` en el `case 'registrar_produccion'` del switch:
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.js
const tabacosNum = parseInt(args.tabacos) || 0;
const cestasNum  = parseInt(args.cestas)  || 0;
const pesosNum   = parseInt(args.abono_pesos) || 0;
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

---

### Bug 5 — Query `recepcion_diaria` solo buscaba estado `'pendiente'`
**Síntoma:** El bot respondía "Blanca no tiene despacho activo" aunque sí tenía registro en la semana.

**Causa raíz:** La query filtraba `.eq('estado', 'pendiente')` pero el registro podía estar en estado `'activo'`.

**Solución:** Cambiado a `.in('estado', ['pendiente', 'activo'])`.

---

### Bug 6 — Doble consulta anidada para obtener empleado (riesgo de crash silencioso)
**Síntoma:** Aunque no siempre fallaba visiblemente, la función hacía una consulta dentro de otra para buscar el `id` del empleado por `codigo`, cuando `consultarDeudaEmpleado()` ya devuelve el `id` directamente.

**Código problemático:**
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.js
// ❌ ANTES: doble consulta peligrosa
const { data: emp } = await supabase.from('empleados_fabriquines')
  .select('*')
  .eq('id', (await supabase.from('empleados_fabriquines')
    .select('id').eq('codigo', empRes.codigo).single()).data.id)
  .single();
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

**Solución:**
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.js
// ✅ AHORA: consulta simple usando el ID ya resuelto
const { data: emp } = await supabase
  .from('empleados_fabriquines')
  .select('*')
  .eq('id', empRes.id)
  .single();
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

---

### Bug 7 — `obtener_color_cesta_para_pregunta` no devolvía cantidad
**Síntoma:** El bot solo sabía el color de las cestas, no cuántas se habían despachado. Las respuestas eran incompletas.

**Solución:** Se añadió `cestas_cant` al `select` de `despachos_registro`. La función ahora devuelve `{ color, cantidad, nombre }`. El system prompt y la descripción de la herramienta se actualizaron para indicar que el bot debe usar ambos datos al preguntar al usuario.

---

### Bug 8 — Bloqueo al pagar deuda sin despacho activo en la semana (16/05/2026)
**Síntoma:** El bot invocaba `registrar_produccion` correctamente con todos los parámetros, pero respondía "no tiene despacho activo para esta semana". El registro nunca llegaba a Supabase.

**Causa raíz — Conflicto de diseño:** El sistema asume que registrar tabacos = "devolvió tabacos del despacho de ESTA semana". Pero el caso real de Blanca Alvarado es diferente: ella recibió tabacos hace **semanas**, esa semana ya fue liquidada en el ERP (su `recepcion_diaria` pasó a estado `'liquidado'`), y ahora está pagando esa deuda vieja. No tiene (ni necesita) un despacho nuevo esta semana.

**Solución — Modo "Pago de Deuda":**
Se agregó un modo de fallback en `registrarProduccionRapida()`:
- Si `recepcion_diaria` no tiene registro activo esta semana → verificar si `deuda_tabacos > 0`
- Si **SÍ tiene deuda**: procesar igualmente (descontar `deuda_tabacos`, actualizar inventario y `movimientos`), pero **saltar el `UPDATE` de `recepcion_diaria`** ya que no corresponde a esta semana
- Si **NO tiene deuda**: devolver error descriptivo

**Distinción de modos en el mensaje de respuesta:**
- Modo normal: `"sumado al día *vie*"` 
- Modo deuda: `"registrado como *Pago de Deuda* (sin despacho activo esta semana)"`

---

### Bug 9 — `esExtra` enviado como string `"false"` en lugar de booleano (16/05/2026)
**Síntoma:** Los tabacos de un pago de deuda se guardaban en el inventario como `"Tabacos Extras (Ventas)"` en lugar de `"Tabacos"`. El movimiento decía `"Registro Rápido (EXTRA)"`.

**Causa raíz:** En JavaScript, el operador `||` evalúa el operando izquierdo como truthy/falsy. Si el LLM manda `args.esExtra = "false"` (un string), la expresión `args.esExtra || false` devuelve `"false"` (el string), que es truthy. Resultado: el bot interpretaba que eran extras cuando no lo eran.

**Solución:** Cast explícito a booleano real en `ejecutarHerramienta`:
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.js
const esExtraBool = args.esExtra === true || args.esExtra === 'true' || args.esExtra === 'True';
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

---

### Bug 10 — Bot no informaba el saldo pendiente después del registro (16/05/2026)
**Síntoma:** El bot confirmaba "producción registrada" pero no decía cuánto le quedaba pendiente al fabriquín, generando incertidumbre.

**Solución:** Se añadió un bloque `📊 Saldo pendiente` al final del mensaje de confirmación, calculado en tiempo real post-transacción:
- **Tabacos:** `deuda_tabacos` actualizada de `empleados_fabriquines`
- **Pesos:** Re-consulta `prestamos_fabriquines` con `estado='activo'` después del abono
- **Cestas:** `cestas_cant` del `despachos_registro` más reciente, menos la suma histórica de cestas devueltas en todos los registros de `recepcion_diaria` + las de hoy (si es Modo Pago de Deuda)
- Si saldo = 0 en todo: el bot celebra con `🎉 ¡Ha saldado toda su deuda!`

**Ejemplo de mensaje resultante:**
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.
✅ Registro Exitoso
👤 Empleado: BLANCA ALVARADO (F03)
📈 +5.000 u registrado como Pago de Deuda y +4 cestas.
💰 Abono monetario: Se descontaron $25.000 de sus préstamos.

📊 Saldo pendiente de BLANCA ALVARADO:
   🚬 Tabacos: 5.000 u
   🧺 Cestas:  6
   💵 Pesos:   $25.000
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

---

### Bug 11 — Alucinación de máquinas inexistentes en herramienta de mantenimiento (16/05/2026)
**Síntoma:** Al preguntarle al bot "¿Qué máquinas están funcionando?", respondía con 16 máquinas, pero inventaba nombres como "Maquina 10, Maquina 11", cuando esas no existen en [[Supabase]].
**Causa raíz:** La herramienta `consultar_maquinaria` **sólo retornaba la cantidad** de máquinas operativas (ej: `funcionales: 16`), pero **no devolvía los nombres** reales de las máquinas. Al pedirle el usuario que las nombrara, el LLM intentaba complacerlo e inventaba los 16 nombres a partir del número.
**Solución:** Se modificó la función `consultarMaquinaria` en `bot_core.js` para que retorne los arreglos con los nombres exactos de las máquinas en cada estado, además de los totales numéricos.
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.js
// Ahora retorna:
{
    total_funcionales: 16,
    nombres_funcionales: ["Planta", "Enrolladora-1", ...],
    total_con_fallas: 12,
    nombres_con_fallas: ["Picadora", ...],
    mantenimientos_urgentes: [...]
}
```

---

## 🎨 Mejoras de Interfaz y Arquitectura (14/07/2026)

### 1. Refactorización Módulo Anilladores
- Se separó la vista única en tres subrutas y vistas modulares (`despacho`, `recepcion`, `inventario`).
- Se rediseñó la UI a cajas horizontales (`.section-box`) consistentes con el resto de la aplicación.
- Se agregaron modelos dinámicos de anillos ("Anillos Gato" y "Anillos Encava") en el despacho.
- Se documentó la lógica artesanal de la "Pega Yuca" producida por el Sr. Gregorio.

### 2. Refactorización Módulo Envolvedoras
- Se implementó la misma arquitectura modular de Anilladores (división en `despacho`, `recepcion` y `control`).
- Se incluyó la corrección del CSS para Dark Mode en los contenedores `.section-box` que antes se mostraban con fondo blanco.
- Se añadió un formulario dedicado para la Recepción de Tabacos Envueltos, inyectándolos directamente al inventario final.
- Se creó la documentación oficial en `Módulo Envolvedoras.md`.

---

## 🗄️ Checklist de [[Supabase]] — Condiciones para que el bot funcione

Para que `registrar_produccion` funcione correctamente, se deben cumplir estas condiciones en la base de datos:

| Tabla | Condición requerida | Qué pasa si falla |
|---|---|---|
| `empleados_fabriquines` | El empleado debe existir con `nombre` o `codigo` buscable | El bot responde "no encontré a nadie con ese nombre" |
| `recepcion_diaria` | **Opcional desde Bug 8:** Si hay registro activo (`pendiente`/`activo`) se actualiza. Si no hay pero existe `deuda_tabacos > 0`, se procesa en modo Pago de Deuda | Sin deuda Y sin registro → el bot bloquea correctamente |
| `despachos_registro` | Debe existir un registro con `color_cesta` y `cestas_cant` para el `empleado_id` | La herramienta de cestas devuelve `color: 'de color'` y `cantidad: 0` |
| `prestamos_fabriquines` | Debe existir un préstamo con `estado = 'activo'` y `saldo_pendiente > 0` para que el abono funcione | El bot registra tabacos/cestas OK pero advierte que no había deuda monetaria activa |
| `inventario` | Debe existir una fila con `material = 'Tabacos'` o se crea automáticamente | Sin riesgo, se inserta si no existe |

> **⚠️ Punto crítico:** Si Blanca Alvarado no tiene registro en `recepcion_diaria` para la semana del 16/05/2026 con estado `pendiente` o `activo`, el bot **nunca podrá registrar** aunque todo lo demás esté correcto. Hay que verificar en el sistema web que el despacho de la semana esté creado para ella.

---

## 🏗️ Notas Arquitectónicas

- El historial de conversación se limita a las últimas **20 interacciones** por chat para evitar que el contexto desborde el context window de Llama 3.1.
- El bot usa **Polling** en local (Docker) y **Webhook** en Vercel/producción. Verificar que `VERCEL=1` y `NODE_ENV=production` estén seteados correctamente en Vercel.
- Ollama debe estar corriendo en `http://host.docker.internal:11434` (variable `OLLAMA_HOST`). Si el contenedor no llega a Ollama, el bot responde con el mensaje del ovillo de lana 🧶.

---

_Última modificación: 16/05/2026 — Gonzalo Andres Jaimes_
