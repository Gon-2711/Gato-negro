> Etiquetas: #negocio #operaciones #logistica

# 📖 Diccionario de Datos y Eslabones de Producción

Este documento explica la terminología interna de la [[EMPRESA_GATO_NEGRO|Fábrica Gato Negro]] para que el sistema y los agentes de IA entiendan el contexto logístico.

## Eslabones de Producción (Roles)

1. **Fabriquín:** Es el artesano base. Recibe la materia prima cruda (Capa, Capote, Picadura) y arma los tabacos "en bola".
2. **Envolvedor:** Recibe el tabaco del fabriquin y le aplica la hoja exterior y el celofán protector.
3. **Anillador:** Operario encargado de colocar la vitola (etiqueta corporativa del Gato Negro) al cigarro ya envuelto.
4. **Empacador:** Toma los tabacos terminados y los sella en Cajas (de 25 o 50 unidades) y Bultos Maestros para su despacho a mayoristas.

## Conceptos Operativos

- **La Cesta:** Es la unidad de medida logística y de transporte dentro de la planta.
  - Para los _Fabriquines_, 1 cesta siempre contiene **1,250 tabacos normales**.
  - Para los _Anilladores_, 1 cesta contiene **1,500 tabacos anillados**.
  - Se prestan cestas de distintos colores (ej. Cestas Rojas, Cestas Negras) para auditoría visual.
- **La Tarea / Meta:** Es la cantidad de tabacos que el administrador exige al fabriquin para la semana.
- **Mermas:** Residuos del proceso de fabricación que se retornan a la bodega.
  - _Vena:_ El tallo central de la hoja de tabaco. Se paga al operario para incentivar su devolución.
  - _Recorte:_ Trozos de hoja sobrantes. También se pagan.
  - _Rezago:_ Tabacos mal armados o defectuosos que son devueltos para descuento o reproceso.
- **Deuda Rotativa:** En Gato Negro, la materia prima se entrega "a crédito". Si un fabriquin pide 1000 tabacos en material y solo entrega 800 físicos, se le genera una "Deuda de 200 Tabacos" para la próxima semana.
