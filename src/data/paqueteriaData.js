// Datos compartidos entre la sección de Servicios del home y la página de Paquetería,
// para no mantener las mismas tarifas/galería duplicadas en dos archivos.

export const RATE_GROUPS = [
    {
        label: '10 a 40 lbs (4.5 a 18 kg)',
        boxes: [
            { size: '15×12×10 in', price: 119 },
            { size: '16×12×12 in', price: 129 },
            { size: '14×14×14 in', price: 139 },
            { size: '16×16×16 in', price: 189 },
        ],
    },
    {
        label: '41 a 65 lbs (18.6 a 29.5 kg)',
        boxes: [
            { size: '16×18×18 in', price: 239 },
            { size: '21×16×15 in', price: 239 },
            { size: '24×18×18 in', price: 299 },
            { size: '22×22×22 in', price: 389 },
        ],
    },
];

export const NOTES = [
    '📅 Salida cada semana, todos los viernes',
    '🚢 Entrega marítima: 4 a 8 semanas hábiles',
    '✈️ Entrega aérea: 9 a 20 días hábiles',
    '🛡️ Gasto de manejo en destino y seguro adicional incluidos',
    '📦 Envío UPS incluido (drop off en oficina, restricciones aplican)',
    '🏢 +110 oficinas · entrega en +320 puntos en Venezuela',
    '🎁 Tu familiar no paga nada al recibir el paquete',
];

export const TV_PRICING = [
    { size: '32"', price: 164 },
    { size: '40" – 43"', price: 194 },
    { size: '48" – 50"', price: 274 },
    { size: '55" – 60"', price: 484 },
    { size: '65"', price: 585 },
    { size: '70"', price: 635 },
    { size: '75"', price: 724 },
];

export const GALLERY = [
    { file: 'agente-autorizado-banner.png', alt: 'ByS Global Services, agente autorizado de carga de Cargoexpress Venezuela, aliados con Tealca', wide: true },
    { file: 'tarifas-maritimo.png', alt: 'Tarifas de envíos marítimos a Venezuela por tamaño de caja' },
    { file: 'recomendaciones-cajas.png', alt: 'Recomendaciones para empacar y enviar cajas heavy duty' },
    { file: 'agente-autorizado.png', alt: 'ByS Global Services, agente autorizado de carga en Fishers, Indiana' },
];
