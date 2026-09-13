import { useState } from 'react';
import { Box, Typography, Stack, Card, Chip, Button, Grid, Dialog, IconButton } from '@mui/material';
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineScale,
    HiOutlineDocumentText,
    HiOutlinePrinter,
    HiOutlineTruck,
    HiXMark,
} from 'react-icons/hi2';

const STEPS = [
    {
        icon: <HiOutlineChatBubbleLeftRight size={26} />,
        title: 'Envíanos los datos de remitente y destinatario',
        desc: 'Escríbenos por WhatsApp o al correo info@cargoexpressvenezuela.com con el nombre, teléfono y dirección de quien envía y de quien recibe en Venezuela.',
    },
    {
        icon: <HiOutlineScale size={26} />,
        title: 'Envíanos las medidas y el peso de tu caja',
        desc: 'Necesitamos alto, largo y ancho en pulgadas, y el peso en libras. El peso máximo por caja para este servicio es 49 lbs.',
    },
    {
        icon: <HiOutlineDocumentText size={26} />,
        title: 'Te preparamos la guía y la factura',
        desc: 'Con esos datos armamos tu guía de envío y factura, y te las enviamos junto con el enlace para realizar el pago.',
    },
    {
        icon: <HiOutlinePrinter size={26} />,
        title: 'Imprime tu etiqueta prepagada',
        desc: 'Una vez confirmado el pago, te enviamos tu etiqueta (label) de UPS ya prepagada. Imprímela y pégala en tu caja.',
        image: { file: 'ups-etiqueta-muestra.webp', alt: 'Ejemplo de etiqueta prepagada de UPS' },
    },
    {
        icon: <HiOutlineTruck size={26} />,
        title: 'Entrega tu caja en cualquier oficina de UPS Store',
        desc: 'Lleva tu caja con la etiqueta pegada a cualquier UPS Store — no hace falta que la traigas a nuestra oficina. Guarda el recibo que te den ahí y envíanoslo por WhatsApp o correo para confirmar el envío.',
    },
];

const OVERVIEW_IMAGES = [
    { file: 'ups-49lbs-pasos.webp', alt: 'Envía tus paquetes por UPS, máximo 49 lbs por paquete, 4 pasos' },
    { file: 'sendbox-pasos.webp', alt: 'Pasos del servicio SendBox: datos, medidas, guía, etiqueta y entrega' },
];

export default function EnvioUPS() {
    const [lightbox, setLightbox] = useState(null);

    return (
        <Box>
            <Chip label="📦 Servicio SendBox" color="primary" sx={{ fontWeight: 700, py: 2.5, mb: 3 }} />

            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Con SendBox puedes enviar tu propia caja hacia Venezuela sin tener que traerla a nuestra oficina:
                nosotros te preparamos la etiqueta de envío prepagada y tú solo la entregas en cualquier tienda UPS Store
                de Estados Unidos. Ideal si no vives cerca de nuestras instalaciones o prefieres hacerlo desde tu casa.
            </Typography>

            <Typography variant="body2" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
                Peso máximo: 49 lbs por caja. Se recomienda usar cajas heavy duty en buen estado.
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 5 }}>
                {OVERVIEW_IMAGES.map((img) => (
                    <Grid item xs={12} sm={6} key={img.file}>
                        <Box
                            component="button"
                            onClick={() => setLightbox(img)}
                            sx={{
                                p: 0, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3,
                                overflow: 'hidden', cursor: 'pointer', bgcolor: 'transparent', lineHeight: 0,
                                '&:hover img': { transform: 'scale(1.03)' },
                            }}
                        >
                            <Box
                                component="img"
                                src={`/assets/images/paqueteria/${img.file}`}
                                alt={img.alt}
                                sx={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Cómo funciona, paso a paso</Typography>

            <Stack spacing={2} sx={{ mb: 5 }}>
                {STEPS.map((step, i) => (
                    <Card key={step.title} sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
                        <Stack direction="row" spacing={2.5} sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: 'primary.main', color: 'white', fontWeight: 900,
                                }}
                            >
                                {i + 1}
                            </Box>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Box sx={{ color: 'primary.main', display: 'flex' }}>{step.icon}</Box>
                                    <Typography fontWeight={800}>{step.title}</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                            </Box>
                        </Stack>
                        {step.image && (
                            <Box
                                component="button"
                                onClick={() => setLightbox(step.image)}
                                sx={{
                                    p: 0, width: { xs: '100%', sm: 140 }, flexShrink: 0, border: '1px solid', borderColor: 'divider',
                                    borderRadius: 2, overflow: 'hidden', cursor: 'pointer', bgcolor: 'transparent', lineHeight: 0,
                                    '&:hover img': { transform: 'scale(1.05)' },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={`/assets/images/paqueteria/${step.image.file}`}
                                    alt={step.image.alt}
                                    sx={{ width: '100%', height: 90, objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                                />
                            </Box>
                        )}
                    </Card>
                ))}
            </Stack>

            <Card sx={{ p: 3, bgcolor: 'action.hover', textAlign: 'center' }}>
                <Typography fontWeight={700} sx={{ mb: 2 }}>¿Listo para enviar tu caja?</Typography>
                <Button
                    variant="contained"
                    href="https://wa.me/18328159187"
                    target="_blank"
                    rel="noopener"
                    sx={{ borderRadius: 3, py: 1.25, px: 3 }}
                >
                    Escríbenos por WhatsApp para empezar
                </Button>
            </Card>

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
