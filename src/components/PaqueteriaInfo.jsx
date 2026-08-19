import { useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Chip,
    Dialog,
    IconButton,
} from '@mui/material';
import { HiXMark } from 'react-icons/hi2';

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
    '🚢 Entrega marítima: 6 a 8 semanas hábiles',
    '✈️ Entrega aérea: 9 a 20 días hábiles',
    '🛡️ Gasto de manejo en destino y seguro adicional incluidos',
    '📦 Envío UPS incluido (drop off en oficina, restricciones aplican)',
    '🏢 +110 oficinas · entrega en +320 puntos en Venezuela',
    '🎁 Tu familiar no paga nada al recibir el paquete',
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

    return (
        <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                <Chip label="🤝 Agentes autorizados de Cargoexpress Venezuela" color="primary" sx={{ fontWeight: 700, py: 2.5 }} />
                <Chip label="Aliados con Tealca" variant="outlined" sx={{ fontWeight: 700, py: 2.5 }} />
            </Stack>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Enviamos encomiendas y mercancía desde Estados Unidos con entrega puerta a puerta en toda Venezuela.
            </Typography>

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

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Nuestra red y servicio</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                    gap: 1.5,
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
