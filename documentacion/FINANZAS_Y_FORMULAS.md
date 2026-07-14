> Etiquetas: #negocio #finanzas #operaciones

# 💰 Finanzas, Tarifas y Fórmulas Contables ([[EMPRESA_GATO_NEGRO|Gato Negro]])

Este documento contiene las reglas de negocio exactas utilizadas para reemplazar las antiguas tablas de Excel de la fábrica.

## 1. Fórmulas de Conversión de Materia Prima (Destajo)

Por cada **1,000 Tabacos (1 Tarea)** asignados a un [[DICCIONARIO_FABRICA|fabriquin]], el sistema de bodega le debe despachar exactamente:

- **Capa:** `1.0 kg`
- **Capote:** `1.8 kg`
- **Picadura:** `7.0 kg`

## 2. Tarifas de Liquidación y Pago a Operarios

Precios base del sistema para liquidar la nómina de los fabriquines:

- **Tabaco Sano Elaborado:** `$85 COP` por unidad.
- **Retorno de Vena (Merma útil):** `$3,500 COP` por cada Kilogramo.
- **Retorno de Recorte (Merma degradada):** `$6,500 COP` por cada Kilogramo.
- **Sub-venta (Tabacos fabricados extra):** `$230 COP` por unidad.

**Fórmula de Cierre Semanal:**
`Total Ganado = (Tabacos_entregados * 85) + (Kilos_recorte * 6500) + (Kilos_vena * 3500) + (Tabacos_extra * 230)`
`Pago Neto = Total Ganado - Descuentos_y_Prestamos`

## 3. Tarifas del Eslabón de Empaque y Anillado

- **Anillado de Tabacos:** `$12,000 COP` por cada cesta procesada. (1 Cesta de anillado equivale a 1,500 tabacos).
- **Empaque en Bulto de 50:** `$10,000 COP` (Cada bulto de 50 trae 25 cajas).
- **Empaque en Bulto de 25:** `$7,000 COP` (Cada bulto de 25 trae 50 cajas).
- **Caja Suelta de 50:** `$400 COP`.
- **Caja Suelta de 25:** `$140 COP`.

## 4. Costos de Suministros (Descuentos)

- **Goma:** `$60,000 COP` por galón/unidad.
- **Papel Periódico:** `$6,000 COP` por Kilogramo.
