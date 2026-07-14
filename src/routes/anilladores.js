const express = require('express');
const router = express.Router();
const { supabase, mostrarAlerta, obtenerHoraColombia } = require('../lib/shared');
const { isAdmin } = require('../lib/middleware');

// --- REDIRECCIÓN PARA EVITAR CRASH DEL NAVEGADOR ---
router.get('/anilladores/dashboard', (req, res) => res.redirect('/anilladores/inventario'));

// ---------------- INVENTARIO Y PERSONAL ----------------
router.get('/anilladores/inventario', isAdmin, async (req, res) => {
    const { data: empleados } = await supabase.from('empleados_anilladores').select('*').order('nombre');
    const { data: insumos } = await supabase.from('inventario_insumos_graficos').select('*').order('material');
        
    res.render('produccion/anilladores_inventario', { 
        empleados: empleados || [], 
        insumos: insumos || []
    });
});

// ---------------- DESPACHO ----------------
router.get('/anilladores/despacho', isAdmin, async (req, res) => {
    const { data: empleados } = await supabase.from('empleados_anilladores').select('*').order('nombre');
    res.render('produccion/anilladores_despacho', { empleados: empleados || [] });
});

// ---------------- RECEPCIÓN ----------------
router.get('/anilladores/recepcion', isAdmin, async (req, res) => {
    const { data: empleados } = await supabase.from('empleados_anilladores').select('*').order('nombre');
    res.render('produccion/anilladores_recepcion', { empleados: empleados || [] });
});

// ---------------- GESTIÓN DE EMPLEADOS ----------------
router.post('/api/anilladores/empleados', isAdmin, async (req, res) => {
    const { nombre, cedula } = req.body;
    try {
        await supabase.from('empleados_anilladores').insert([{ nombre, cedula }]);
        res.redirect('/anilladores/inventario?ok=empleado_creado');
    } catch(e) {
        res.redirect('/anilladores/inventario?error=crear_empleado');
    }
});

// ---------------- DESPACHO (ASIGNAR TRABAJO) ----------------
router.post('/api/anilladores/despachar', isAdmin, async (req, res) => {
    const { empleado_id, cantidad_tabacos, modelo_anillo, cantidad_anillos, cantidad_pega } = req.body;
    const tabacos = parseInt(cantidad_tabacos) || 0;
    const anillos = parseInt(cantidad_anillos) || 0;
    const pega = parseInt(cantidad_pega) || 0;

    if (!empleado_id || tabacos <= 0 || anillos <= 0 || !modelo_anillo) {
        return res.send(mostrarAlerta('Error', 'Datos inválidos o en cero.', 'error'));
    }

    try {
        const { data: emp } = await supabase.from('empleados_anilladores').select('*').eq('id', empleado_id).single();
        if (!emp) throw new Error("Empleado no encontrado");

        // Aumentar la deuda del empleado
        await supabase.from('empleados_anilladores').update({
            deuda_tabacos: emp.deuda_tabacos + tabacos,
            deuda_anillos: emp.deuda_anillos + anillos
        }).eq('id', empleado_id);

        // Descontar inventario gráfico (según el modelo seleccionado)
        const { data: invAnillos } = await supabase.from('inventario_insumos_graficos').select('*').eq('material', modelo_anillo).single();
        if (invAnillos) {
            await supabase.from('inventario_insumos_graficos').update({ cantidad: invAnillos.cantidad - anillos }).eq('id', invAnillos.id);
        }

        res.send(mostrarAlerta('Éxito', `Se asignaron ${tabacos} tabacos a ${emp.nombre}.`, 'success', '/anilladores/despacho'));
    } catch(e) {
        console.error(e);
        res.send(mostrarAlerta('Error', 'Fallo al despachar', 'error'));
    }
});

// ---------------- RECEPCIÓN (RECIBIR TRABAJO TERMINADO) ----------------
router.post('/api/anilladores/recibir', isAdmin, async (req, res) => {
    const { empleado_id, tabacos_anillados, merma_anillos, merma_tabacos } = req.body;
    const anillados = parseInt(tabacos_anillados) || 0;
    const m_anillos = parseInt(merma_anillos) || 0;
    const m_tabacos = parseInt(merma_tabacos) || 0;
    const tiempo = obtenerHoraColombia();

    try {
        const { data: emp } = await supabase.from('empleados_anilladores').select('*').eq('id', empleado_id).single();
        if (!emp) throw new Error("Empleado no encontrado");

        // Guardar la recepción
        await supabase.from('recepcion_anilladores').insert([{
            empleado_id,
            fecha: tiempo.fecha,
            tabacos_anillados: anillados,
            merma_anillos: m_anillos,
            merma_tabacos: m_tabacos
        }]);

        // Restar la deuda
        const nuevaDeudaTabacos = Math.max(0, emp.deuda_tabacos - (anillados + m_tabacos));
        const nuevaDeudaAnillos = Math.max(0, emp.deuda_anillos - (anillados + m_anillos));

        await supabase.from('empleados_anilladores').update({
            deuda_tabacos: nuevaDeudaTabacos,
            deuda_anillos: nuevaDeudaAnillos
        }).eq('id', empleado_id);

        res.send(mostrarAlerta('Éxito', `Recepción guardada.`, 'success', '/anilladores/recepcion'));
    } catch(e) {
        console.error(e);
        res.send(mostrarAlerta('Error', 'Fallo al recibir', 'error'));
    }
});

module.exports = router;
