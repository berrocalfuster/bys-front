import { Box, Container, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { HiOutlineArchiveBox, HiOutlineMapPin, HiOutlineGlobeAlt, HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi2';

const TRUST_ITEMS = [
    { icon: <HiOutlineMapPin size={20} />, label: 'Seguimiento en vivo' },
    { icon: <HiOutlineGlobeAlt size={20} />, label: 'Red Cargoexpress · Tealca' },
    { icon: <HiOutlineShieldCheck size={20} />, label: 'Pagos seguros' },
];

export default function QuickAccessPanel({ onCalculatorClick, onCasilleroClick }) {
    return (
        <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <Card sx={{ p: { xs: 3, md: 4 } }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                onClick={onCalculatorClick}
                                sx={{
                                    justifyContent: 'space-between', textAlign: 'left', p: 2.5, borderRadius: 3,
                                    bgcolor: 'action.hover', color: 'text.primary',
                                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <HiOutlineArchiveBox size={26} />
                                    <Box>
                                        <Typography fontWeight={800}>Calcular envío de paquete</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Peso, caja y precio al instante</Typography>
                                    </Box>
                                </Stack>
                                <HiArrowRight size={20} />
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                onClick={onCasilleroClick}
                                sx={{
                                    justifyContent: 'space-between', textAlign: 'left', p: 2.5, borderRadius: 3,
                                    bgcolor: 'action.hover', color: 'text.primary',
                                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <HiOutlineMapPin size={26} />
                                    <Box>
                                        <Typography fontWeight={800}>Mis Envíos / Mi Casillero</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>Revisa tus remesas y paquetes</Typography>
                                    </Box>
                                </Stack>
                                <HiArrowRight size={20} />
                            </Button>
                        </Grid>
                    </Grid>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1.5, sm: 4 }}
                        justifyContent="center"
                        sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
                    >
                        {TRUST_ITEMS.map((item) => (
                            <Stack key={item.label} direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                                {item.icon}
                                <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}
