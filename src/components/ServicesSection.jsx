import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, Stack, Chip, Button, List, ListItem, Dialog, IconButton } from '@mui/material';
import {
    HiOutlineBanknotes,
    HiOutlineArchiveBox,
    HiOutlineCheckCircle,
    HiXMark,
} from 'react-icons/hi2';
import { RATE_GROUPS, GALLERY } from '../data/paqueteriaData';

const REMESAS_POINTS = [
    'Pago Móvil, transferencia bancaria o efectivo',
    'Tasa del día actualizada en tiempo real',
    'Confirmación de entrega inmediata',
    'Sin límites para envíos frecuentes',
];

const PAQUETERIA_POINTS = [
    'Recogida en Estados Unidos a domicilio o vía UPS',
    'Agentes autorizados de Cargoexpress Venezuela, aliados con Tealca',
    'Entrega puerta a puerta en +320 puntos de Venezuela',
    'Seguimiento del paquete en cada etapa',
];

export default function ServicesSection() {
    const navigate = useNavigate();
    const [lightbox, setLightbox] = useState(null);

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.5 }}>
                        Todo en un solo lugar
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mb: 1.5 }}>
                        Nuestros servicios
                    </Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 560, mx: 'auto' }}>
                        Combinamos envío de dinero y paquetería en un solo servicio, para conectar a las familias venezolanas con sus seres queridos en USA.
                    </Typography>
                </Box>

                {/* Dos servicios */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 4, height: '100%' }}>
                            <Box sx={{ fontSize: '2.2rem', color: 'primary.main', mb: 2 }}><HiOutlineBanknotes /></Box>
                            <Typography variant="h5" fontWeight={800} gutterBottom>Remesas</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Envía dinero desde Estados Unidos hacia Venezuela con tasas competitivas y sin comisiones ocultas.
                            </Typography>
                            <List dense>
                                {REMESAS_POINTS.map((point) => (
                                    <ListItem key={point} sx={{ px: 0, gap: 1.5 }}>
                                        <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}><HiOutlineCheckCircle /></Box>
                                        <Typography variant="body2">{point}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 4, height: '100%', border: '2px solid', borderColor: 'primary.main', position: 'relative' }}>
                            <Chip label="Puerta a puerta" color="primary" size="small" sx={{ position: 'absolute', top: -12, left: 24, fontWeight: 700 }} />
                            <Box sx={{ fontSize: '2.2rem', color: 'primary.main', mb: 2 }}><HiOutlineArchiveBox /></Box>
                            <Typography variant="h5" fontWeight={800} gutterBottom>Paquetería</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Envía encomiendas y mercancía desde USA con entrega directa en la puerta de tu familia.
                            </Typography>
                            <List dense>
                                {PAQUETERIA_POINTS.map((point) => (
                                    <ListItem key={point} sx={{ px: 0, gap: 1.5 }}>
                                        <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}><HiOutlineCheckCircle /></Box>
                                        <Typography variant="body2">{point}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tarifas de paquetería */}
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3, textAlign: 'center' }}>
                    Tarifas de envío marítimo a Venezuela
                </Typography>
                {RATE_GROUPS.map((group) => (
                    <Box key={group.label} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>{group.label}</Typography>
                        <Grid container spacing={2}>
                            {group.boxes.map((b) => (
                                <Grid item xs={6} sm={3} key={b.size}>
                                    <Card sx={{ p: 2.5, textAlign: 'center' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{b.size}</Typography>
                                        <Typography variant="h5" fontWeight={900} color="primary.main">${b.price}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                {/* Galería */}
                <Grid container spacing={1.5} sx={{ mt: 2, mb: 5 }}>
                    {GALLERY.map((img) => (
                        <Grid item xs={12} sm={img.wide ? 12 : 4} key={img.file}>
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
                                    sx={{ width: '100%', height: img.wide ? 220 : 180, objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/p/paqueteria')}
                        sx={{ borderRadius: 3, py: 1.5, px: 4 }}
                    >
                        Ver todos los detalles de paquetería
                    </Button>
                    <Button
                        variant="text"
                        size="large"
                        onClick={() => navigate('/p/terminos')}
                        sx={{ borderRadius: 3, py: 1.5, px: 4 }}
                    >
                        Ver términos y condiciones →
                    </Button>
                </Stack>
            </Container>

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
