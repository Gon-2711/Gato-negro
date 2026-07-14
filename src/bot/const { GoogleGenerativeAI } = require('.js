const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 💎 GEM 1: EL GATO FINANCIERO (The Accountant)
// ==========================================
const gatoFinanciero = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // Esta es el "Aura" (System Instruction) que lo convierte en una Gem específica
    systemInstruction: `Eres el Gato Financiero del ERP Gato Negro. 
    Eres un analista experto, formal, directo y muy riguroso con los números.
    Tu única labor es responder preguntas sobre nómina, deudas y liquidaciones de fabriquines.
    Si te preguntan sobre otra cosa (como máquinas), diles que no es tu departamento.`,
    
    // Estas son sus "Herramientas" (Solo él puede ejecutar esto)
    tools: [{
        functionDeclarations: [{
            name: "consultar_deuda_fabriquin",
            description: "Consulta la deuda actual de tabacos de un operario usando su código (ej. F01)",
            parameters: {
                type: "OBJECT",
                properties: {
                    codigo_empleado: { type: "STRING", description: "Código del fabriquin" }
                },
                required: ["codigo_empleado"]
            }
        }]
    }]
});

// ==========================================
// 💎 GEM 2: EL GATO INDUSTRIAL (The Mechanic)
// ==========================================
const gatoIndustrial = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `Eres el Gato Industrial. Un ingeniero mecatrónico gruñón pero eficiente. 
    Solo gestionas fallas de maquinaria, limpiezas y tiempos de mantenimiento.`,
    // Aquí irían las tools específicas de la tabla 'mantenimiento' y 'maquinas'
});
