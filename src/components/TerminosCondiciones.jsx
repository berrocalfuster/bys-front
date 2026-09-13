import {
    Box,
    Typography,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    Divider,
} from '@mui/material';
import { HiChevronDown } from 'react-icons/hi2';

const GENERAL_TERMS = [
    'Estos términos y condiciones rigen el uso de los servicios de remesas y paquetería de B&S Global Services. Al acceder a nuestra plataforma, usted acepta cumplir con estas disposiciones.',
    '1. Registro: El usuario debe ser mayor de edad y proporcionar información veraz para poder operar en la plataforma.',
    '2. Operaciones: B&S Global Services actúa como intermediario para el envío de remesas hacia Venezuela, y como agente autorizado de Cargoexpress Venezuela para el envío de paquetería puerta a puerta.',
    '3. Comisiones: Todas las tarifas y tasas de cambio se muestran antes de confirmar la operación, sin cargos ocultos.',
    '4. Responsabilidad: El usuario es responsable de la exactitud de los datos del destinatario (nombre, documento y datos bancarios) para garantizar la correcta entrega del envío.',
];

// Política completa de envío marítimo de Cargoexpress Venezuela / Tealca — punto único
// donde vive todo el texto de términos/políticas que se agregue en el futuro.
const SHIPPING_TERMS_SECTIONS = [
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
            'De 65 a 75 lbs por caja: $10 adicionales por cada libra por encima de 65 lbs.',
            'De 75 a 80 lbs por caja: $10 adicionales por cada libra por encima de 75 lbs.',
            'Si tu carga pesa más de 80 lbs, te conviene dividirla — por ejemplo, 3 cajas de 40 lbs (120 lbs en total) optimizan el costo y la seguridad del envío frente a una sola caja muy pesada.',
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

export default function TerminosCondiciones() {
    return (
        <Box>
            <Stack spacing={3} sx={{ mb: 5 }}>
                {GENERAL_TERMS.map((line, i) => (
                    <Typography key={i} variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.1rem' }}>
                        {line}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                Términos y condiciones de envío marítimo (Cargoexpress Venezuela / Tealca)
            </Typography>
            <Box>
                {SHIPPING_TERMS_SECTIONS.map((section) => (
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
        </Box>
    );
}
