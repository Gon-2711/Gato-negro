> Etiquetas: #erp #operaciones #logistica #anilladores

# 🏗️ Diseño y Bitácora: Módulo de Anilladores

Este documento sirve como especificación técnica y registro de desarrollo para el **Módulo de Anilladores**, el eslabón secundario en la cadena de manufactura de la [[EMPRESA_GATO_NEGRO|Fábrica Gato Negro]].

---

## 1. Arquitectura y Requerimientos del Módulo

**Objetivo:** Controlar el inventario de tabacos terminados (desnudos), asignarlos como "tareas" a los anilladores junto con sus insumos gráficos, y liquidar sus producciones (tabacos anillados + mermas).

### 1.1 Base de Datos (Supabase)
Se requerirán las siguientes estructuras:
- `empleados_anilladores`: Datos personales, estado activo/inactivo, deuda actual.
- `insumos_anillado`: Inventario de Goma, Rollos de Anillos, Tinta.
  - *Nota de Negocio:* La pega (goma) la fabrica de forma artesanal el señor Gregorio a base de yuca. Su inventario puede no requerir compras externas, pero sí control de despacho.
- `recepcion_anilladores`: Registro transaccional del trabajo devuelto.

> [!NOTE]
> **Diferencia con Envolvedoras:** El proceso de Anilladores es idéntico a nivel de software que el de Envolvedoras. La única diferencia física es que a los anilladores se les entrega "Anillos + Pega", mientras que a las envolvedoras se les entrega "Papel". Eventualmente, el módulo de envolvedoras heredará esta misma arquitectura.

### 1.2 Rutas Backend (Node.js)
- Panel Administrativo (Dashboard de Anilladores)
- Asignación de Tareas (Traspaso del Kardex)
- Liquidación/Recepción

---

## 📝 Bitácora de Desarrollo (Log)

### Fecha: 14 de Julio de 2026
* **Acción:** Inicialización del documento y planificación arquitectónica.
* **Detalle:** Se movió el archivo a la carpeta `documentacion/` y se estructuró como Bitácora Oficial del Módulo. Se definieron los requerimientos base de Base de Datos y Backend.
* **Siguiente paso:** Creación de las tablas en Supabase.

### Fecha: 14 de Julio de 2026 (15:06)
* **Acción:** Despliegue de Base de Datos.
* **Detalle:** Se ejecutó con éxito el script SQL en Supabase creando las tablas `empleados_anilladores`, `inventario_insumos_graficos` y `recepcion_anilladores`.
* **Siguiente paso:** Implementación del ruteo en Express (`server.js`).

### Fecha: 14 de Julio de 2026 (15:10)
* **Acción:** Creación de Rutas Backend y Vistas Frontend.
* **Detalle:** Se crearon las rutas en `src/routes/anilladores.js` (con soporte para creación de empleados, despacho de tabacos desnudos y recepción de producto terminado). Además, se montó todo en `server.js` y se diseñó la interfaz responsiva en `views/produccion/anilladores_dashboard.ejs` integrando el layout del modo oscuro corporativo.
* **Estado del Módulo:** Operacional Fase 1. Listo para pruebas en vivo.
