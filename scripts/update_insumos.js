const { supabase } = require('../src/lib/shared');

async function main() {
    // Eliminar todo
    const { error: err1 } = await supabase.from('inventario_insumos_graficos').delete().not('id', 'is', null);
    if (err1) console.error("Error deleting:", err1);
    
    // Insertar Anillos Gato y Anillos Encava
    const { error: err2 } = await supabase.from('inventario_insumos_graficos').insert([
        { material: 'Anillos Gato', cantidad: 0, unidad_medida: 'Unidades' },
        { material: 'Anillos Encava', cantidad: 0, unidad_medida: 'Unidades' }
    ]);
    if (err2) console.error("Error inserting:", err2);
    
    console.log("Inventario actualizado correctamente.");
}
main();
