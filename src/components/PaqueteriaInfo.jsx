import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Stack,
    Chip,
    Dialog,
    IconButton,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    Grid,
} from '@mui/material';
import {
    HiXMark,
    HiOutlineCalculator,
    HiChevronDown,
    HiOutlineCube,
    HiOutlineScale,
    HiOutlineTag,
    HiOutlineTv,
    HiOutlineShieldCheck,
} from 'react-icons/hi2';

const RATE_GROUPS = [
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

const NOTES = [
    '📅 Salida cada semana, todos los viernes',
    '🚢 Entrega marítima: 4 a 8 semanas hábiles',
    '✈️ Entrega aérea: 9 a 20 días hábiles',
    '🛡️ Gasto de manejo en destino y seguro adicional incluidos',
    '📦 Envío UPS incluido (drop off en oficina, restricciones aplican)',
    '🏢 +110 oficinas · entrega en +320 puntos en Venezuela',
    '🎁 Tu familiar no paga nada al recibir el paquete',
];

const PACKING_TIPS = [
    { icon: <HiOutlineCube size={24} />, title: 'Cajas Heavy Duty', desc: 'Usa cajas nuevas y resistentes (tipo Lowe\'s). No uses cajas usadas o dañadas.' },
    { icon: <HiOutlineScale size={24} />, title: 'Respeta el peso máximo', desc: 'No abultes ni sobrecargues una sola caja — si pesa mucho, divide la mercancía en varias cajas.' },
    { icon: <HiOutlineTag size={24} />, title: 'Asegura bien tu paquete', desc: 'Cierra con cinta resistente y asegúrate de que quede compacta, no abultada.' },
    { icon: <HiOutlineShieldCheck size={24} />, title: 'No incluyas artículos prohibidos', desc: 'Revisa la lista de artículos restringidos antes de empacar (armas, municiones, líquidos inflamables, entre otros).' },
];

const OVERWEIGHT_TIERS = [
    'De 65 a 75 lbs por caja: $10 adicionales por cada libra por encima de 65 lbs.',
    'De 75 a 80 lbs por caja: $10 adicionales por cada libra por encima de 75 lbs.',
    'Si tu carga pesa más de 80 lbs, te conviene dividirla — por ejemplo, 3 cajas de 40 lbs (120 lbs en total) optimizan el costo y la seguridad del envío frente a una sola caja muy pesada.',
];

const TV_PRICING = [
    { size: '32"', price: 164 },
    { size: '40" – 43"', price: 194 },
    { size: '48" – 50"', price: 274 },
    { size: '55" – 60"', price: 484 },
    { size: '65"', price: 585 },
    { size: '70"', price: 635 },
    { size: '75"', price: 724 },
];

const TERMS_SECTIONS = [
    {
        title: 'Tiempos de entrega y logística',
        items: [
            'Entrega marítima: 4 a 8 semanas hábiles (no incluye sábados, domingos ni feriados), contadas desde que zarpa el barco desde Florida — no desde el día que entregas el paquete en oficina, ya que los paquetes viajan con 2 semanas de anticipación por vía UPS hasta el centro de preparación de embarque en Florida.',
            'Las salidas son cada viernes.',
            'ETA significa "Estimated Time of Arrival" (Tiempo Estimado de Llegada).',
            'La logística naviera puede cambiar sin previo aviso por clima, ruta u otros factores. Los tiempos de aduana también pueden variar y demorar más de lo normal — esto está fuera de nuestro control hasta que se completen los trámites correspondientes.',
            'Los reclamos por envíos marítimos son válidos hasta 90 días hábiles después del envío.',
        ],
    },
    {
        title: 'Peso, embalaje y sobrepeso',
        items: [
            'Peso mínimo: 10 lbs. Peso máximo: 65 lbs por paquete. Pesos mayores pueden incurrir en caja rota y pérdidas.',
            ...OVERWEIGHT_TIERS,
            'El embalaje es responsabilidad del remitente: debe incluir una lista detallada del contenido.',
            'Es responsabilidad del cliente usar cajas heavy duty nuevas (sugerencia: cajas de Lowe\'s) — no usar cajas usadas.',
            'La carga marítima regular incluye gasto de manejo en destino: 38% por caja, con base de $100.',
        ],
    },
    {
        title: 'Artículos restringidos y prohibidos',
        items: [
            'Dinero y valores: efectivo, prendas de oro, monedas, pasaportes, cédulas, tarjetas de débito o crédito.',
            'Equipos de telecomunicaciones: módems, hubs, switches, gateways, firewalls, terminales o repetidores de fibra óptica, equipos de difusión de TV o radio, amplificadores de radiofrecuencia, centrales de conmutación, parlantes.',
            'Accesorios: prendas de camuflaje, chalecos antibalas, pecheras de protección, máscaras antigás, radios, transmisores, cascos, juguetes sexuales.',
            'Alimentos: refrigerados, congelados, perecederos o semillas.',
            'Armas: pistolas, rifles (incluyendo armas deportivas de aire comprimido/paintball), balines y municiones de cualquier tipo.',
            'Belleza: maquillaje, cosméticos y perfumes en grandes cantidades (máximo 12 en general; máximo 4 entre cosméticos, splash y perfumes combinados).',
            'Documentos personales: cédulas, pasaportes, licencias o cualquier identificación.',
            'Electrónicos restringidos: drones de juguete, equipos o accesorios de minería de criptomonedas (fuentes de poder, tarjetas de video).',
            'Antenas: dispositivos Starlink usados, refurbished o renovados.',
            'Herramientas de protección personal: navajas, cuchillos sueltos, tasers, gas pimienta, entre otros.',
            'Sustancias inflamables: alcohol, licores, acetona, gasolina, keroseno, entre otros.',
            'Tabaco: vapes, cigarrillos electrónicos, cigarros y tabaco.',
            'Medicamentos veterinarios: el envío a Venezuela está estrictamente restringido y regulado.',
        ],
    },
    {
        title: 'Electrónicos: límites y reglas especiales',
        items: [
            'Solo se aceptan electrónicos de gama baja en envío marítimo: celulares, laptops, PC, Xbox, PlayStation — máximo 2 equipos electrónicos por paquete marítimo.',
            'Equipos de gama alta (Samsung Galaxy S19 o superior, iPhone 15 o superior) deben enviarse por servicio aéreo, solos o junto con otros artículos.',
            'Para estos equipos es obligatorio declarar marca, modelo y número de serie o IMEI.',
            'Televisores viajan en su caja original o en cualquier otra caja adecuada. Los de más de 55" requieren un crate de madera.',
        ],
    },
    {
        title: 'Seguro, reclamos e incidencias',
        items: [
            'El seguro de la empresa cubre hasta $200 en caso de pérdida total del paquete. No cubre pérdidas parciales.',
            'Seguro adicional disponible: $10 por cada $100 de valor declarado, hasta un máximo de $1,500 — requiere factura original y verificación al momento del envío.',
            'Cualquier incidencia debe reportarse al momento de recibir el paquete o dentro de las siguientes 8 horas, escribiendo a info@cargoexpressvenezuela.com.',
            'No hay devolución de dinero ni de paquetes una vez recibidos.',
        ],
    },
    {
        title: 'Rastreo de tu envío',
        items: [
            'Con tu número de factura original (en mayúscula) o guía, recibirás 7 correos de seguimiento:',
            '1. Recibido en oficina',
            '2. Tránsito marítimo a destino',
            '3. ETA (tiempo estimado de llegada)',
            '4. Arribo a aduana del país',
            '5. Centro de distribución nacional',
            '6. Oficina destino',
            '7. Entregado',
        ],
    },
    {
        title: 'Aduana y documentación requerida',
        items: [
            'La aduana venezolana (SENIAT) tiene autoridad legal para abrir, inspeccionar y decomisar paquetes con productos prohibidos, restringidos o no declarados, según la Ley Orgánica de Aduanas. La revisión puede incluir rayos X y apertura física.',
            'La descripción del contenido debe ser específica — no se acepta "artículos varios". Ejemplo válido: "Ropa, alimentos, zapatos". El valor declarado debe ser congruente con el peso y contenido para evitar revisiones adicionales.',
            'Para envíos con valor declarado superior a $500 USD se requiere adjuntar la factura de soporte en el sistema.',
            'Toda la carga está sujeta a revisión aleatoria tanto en el puerto de origen como en el de destino (Incoterms) — el cliente es responsable de demostrar, mediante documentación, el contenido y valor declarado.',
        ],
    },
    {
        title: 'Carga comercial',
        items: [
            'Oficina principal: Kentucky. Coordina tu envío comercial directamente con nosotros.',
            'Los productos en cantidades comerciales deben incluir factura y están sujetos a trámites de SENIAT, SENCAMER y COMEX, además de cobros adicionales.',
        ],
    },
    {
        title: 'Declaración jurada y aceptación de términos',
        items: [
            'Al realizar tu envío, declaras y certificas que el o los paquetes entregados están libres de elementos o sustancias peligrosas, ilegales o restringidas, y autorizas a Cargo Express Venezuela a abrir e inspeccionar la carga.',
            'Aceptas indemnizar a Cargo Express Venezuela por cualquier lesión o daño derivado del manejo, almacenamiento o transporte de tu envío, así como reembolsar costos legales relacionados.',
            'El valor declarado (FOB) corresponde a efectos de seguro de carga y declaración aduanal en el país de destino.',
            'Al realizar tu envío, aceptas todos los términos y condiciones. El recibo original y demás documentos se conservan en archivo durante al menos 90 días.',
        ],
    },
];

const GALLERY = [
    { file: 'agente-autorizado-banner.png', alt: 'ByS Global Services, agente autorizado de carga de Cargoexpress Venezuela, aliados con Tealca', wide: true },
    { file: 'tarifas-maritimo.png', alt: 'Tarifas de envíos marítimos a Venezuela por tamaño de caja' },
    { file: 'calendario-salidas.png', alt: 'Calendario de salidas semanales a Venezuela' },
    { file: 'recomendaciones-cajas.png', alt: 'Recomendaciones para empacar y enviar cajas heavy duty' },
    { file: 'agente-autorizado.png', alt: 'ByS Global Services, agente autorizado de carga en Fishers, Indiana' },
];

export default function PaqueteriaInfo() {
    const [lightbox, setLightbox] = useState(null);
    const navigate = useNavigate();

    return (
        <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                <Chip label="🤝 Agentes autorizados de Cargoexpress Venezuela" color="primary" sx={{ fontWeight: 700, py: 2.5 }} />
                <Chip label="Aliados con Tealca" variant="outlined" sx={{ fontWeight: 700, py: 2.5 }} />
            </Stack>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Enviamos encomiendas y mercancía desde Estados Unidos con entrega puerta a puerta en toda Venezuela.
            </Typography>

            <Button
                variant="contained"
                startIcon={<HiOutlineCalculator size={20} />}
                onClick={() => navigate('/calculadora-paqueteria')}
                sx={{ borderRadius: 3, py: 1.25, px: 3, mb: 4 }}
            >
                Calcula tu envío
            </Button>

            {RATE_GROUPS.map((group) => (
                <Box key={group.label} sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>{group.label}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                        {group.boxes.map((b) => (
                            <Box
                                key={b.size}
                                sx={{
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    p: 2.5,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    {b.size}
                                </Typography>
                                <Typography variant="h5" fontWeight={900} color="primary.main">
                                    ${b.price}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 3,
                    p: 3,
                    mb: 5,
                }}
            >
                {NOTES.map((note) => (
                    <Typography key={note} variant="body2" sx={{ fontWeight: 600 }}>{note}</Typography>
                ))}
            </Box>

            {/* Consejos de embalaje */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Consejos para embalar tu caja</Typography>
            <Grid container spacing={2} sx={{ mb: 5 }}>
                {PACKING_TIPS.map((tip) => (
                    <Grid item xs={12} sm={6} key={tip.title}>
                        <Box
                            sx={{
                                p: 2.5, height: '100%', display: 'flex', gap: 2,
                                bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 3,
                            }}
                        >
                            <Box sx={{ color: 'primary.main', flexShrink: 0 }}>{tip.icon}</Box>
                            <Box>
                                <Typography fontWeight={800} sx={{ mb: 0.5 }}>{tip.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{tip.desc}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Envío de televisores */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Envío de televisores</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compra tu TV en Estados Unidos y te la llevamos a cualquier parte de Venezuela por vía marítima.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
                {TV_PRICING.map((tv) => (
                    <Box
                        key={tv.size}
                        sx={{
                            bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
                            borderRadius: 3, p: 2.5, textAlign: 'center',
                        }}
                    >
                        <HiOutlineTv size={22} style={{ opacity: 0.5, marginBottom: 6 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{tv.size}</Typography>
                        <Typography variant="h6" fontWeight={900} color="primary.main">${tv.price}</Typography>
                    </Box>
                ))}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 5, color: 'text.secondary' }}>
                *El televisor viaja en su caja original o en cualquier otra caja adecuada. Los televisores de más de 55" requieren un crate de madera.
            </Typography>

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Nuestra red y servicio</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                    gap: 1.5,
                    mb: 5,
                }}
            >
                {GALLERY.map((img) => (
                    <Box
                        key={img.file}
                        component="button"
                        onClick={() => setLightbox(img)}
                        sx={{
                            gridColumn: img.wide ? { sm: '1 / -1' } : undefined,
                            p: 0,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            lineHeight: 0,
                            '&:hover img': { transform: 'scale(1.03)' },
                        }}
                    >
                        <Box
                            component="img"
                            src={`/assets/images/paqueteria/${img.file}`}
                            alt={img.alt}
                            sx={{ width: '100%', height: img.wide ? 220 : 180, objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Términos y condiciones detallados */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Términos y condiciones de envío marítimo</Typography>
            <Box sx={{ mb: 3 }}>
                {TERMS_SECTIONS.map((section) => (
                    <Accordion key={section.title} disableGutters sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: '12px !important', mb: 1.5, overflow: 'hidden' }}>
                        <AccordionSummary expandIcon={<HiChevronDown />}>
                            <Typography fontWeight={700}>{section.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                                {section.items.map((item, i) => (
                                    <ListItem key={i} sx={{ display: 'list-item', pl: 0.5, py: 0.5 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{item}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
                *Tarifas referenciales, sujetas a confirmación al momento del envío. La carga debe estar en oficina una semana antes de la fecha de salida pautada.
                Escríbenos por WhatsApp (USA) al +1 (832) 815-9187 para cotizar tu envío.
            </Typography>

            <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="md" fullWidth>
                <IconButton
                    onClick={() => setLightbox(null)}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', zIndex: 1 }}
                >
                    <HiXMark />
                </IconButton>
                {lightbox && (
                    <Box component="img" src={`/assets/images/paqueteria/${lightbox.file}`} alt={lightbox.alt} sx={{ width: '100%', display: 'block' }} />
                )}
            </Dialog>
        </Box>
    );
}
