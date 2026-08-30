import { useState } from 'react';
import { Box, Button, Typography, Container, Stack, Avatar, Card, Grid, IconButton } from '@mui/material';
import { HiArrowLeft, HiOutlineBanknotes, HiOutlineArchiveBox, HiOutlineMapPin, HiOutlineReceiptPercent, HiArrowRight } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Calculator from './Calculator';
import PaqueteriaCalculator from './PaqueteriaCalculator';

const ACTIONS = [
    { key: 'transfer', icon: <HiOutlineBanknotes size={26} />, title: 'Nueva remesa', desc: 'Calcula y envía dinero a Venezuela' },
    { key: 'package', icon: <HiOutlineArchiveBox size={26} />, title: 'Nuevo envío de paquete', desc: 'Calcula el costo de tu paquetería' },
];

const LINKS = [
    { path: '/mis-envios', icon: <HiOutlineMapPin size={22} />, title: 'Mis Envíos', desc: 'Remesas y paquetes juntos' },
    { path: '/casillero', icon: <HiOutlineArchiveBox size={22} />, title: 'Mi Casillero', desc: 'Tu dirección y paquetes recibidos' },
    { path: '/transactions', icon: <HiOutlineReceiptPercent size={22} />, title: 'Mis Transacciones', desc: 'Historial detallado de remesas' },
];

export default function Profile({ onStartTransfer }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState('home');
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    if (view === 'transfer') {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: { xs: 3, md: 6 } }}>
                <Container maxWidth="lg">
                    <Button startIcon={<HiArrowLeft />} onClick={() => setView('home')} sx={{ mb: 2, fontWeight: 700 }}>
                        Volver a mi cuenta
                    </Button>
                    <Card sx={{ p: { xs: 3, md: 6 } }}>
                        <Calculator
                            onNext={onStartTransfer}
                            externalLoginOpen={loginModalOpen}
                            setExternalLoginOpen={setLoginModalOpen}
                        />
                    </Card>
                </Container>
            </Box>
        );
    }

    if (view === 'package') {
        return (
            <Box>
                <Container maxWidth="sm" sx={{ pt: { xs: 3, md: 6 } }}>
                    <Button startIcon={<HiArrowLeft />} onClick={() => setView('home')} sx={{ fontWeight: 700 }}>
                        Volver a mi cuenta
                    </Button>
                </Container>
                <PaqueteriaCalculator onRequireLogin={() => {}} />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Stack spacing={4} alignItems="center">
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', fontWeight: 700 }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Stack alignItems="center">
                        <Typography variant="h3" fontWeight={700} align="center">
                            ¡Hola, {user?.name}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                            Bienvenido a tu espacio personal
                        </Typography>
                    </Stack>

                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        {ACTIONS.map((action) => (
                            <Grid item xs={12} sm={6} key={action.key}>
                                <Card
                                    onClick={() => setView(action.key)}
                                    sx={{
                                        p: 3, cursor: 'pointer', height: '100%',
                                        display: 'flex', alignItems: 'center', gap: 2,
                                        '&:hover': { borderColor: 'primary.main' },
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main' }}>{action.icon}</Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography fontWeight={800}>{action.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                                    </Box>
                                    <HiArrowRight style={{ opacity: 0.4 }} />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        {LINKS.map((link) => (
                            <Grid item xs={12} sm={4} key={link.path}>
                                <Card
                                    onClick={() => navigate(link.path)}
                                    sx={{
                                        p: 2.5, cursor: 'pointer', height: '100%', textAlign: 'center',
                                        '&:hover': { borderColor: 'primary.main' },
                                    }}
                                >
                                    <Box sx={{ color: 'text.secondary', mb: 1 }}>{link.icon}</Box>
                                    <Typography fontWeight={700} variant="body2">{link.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{link.desc}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ p: 4, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 4, width: '100%', maxWidth: 500 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>Tu cuenta</Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography color="text.secondary" sx={{ minWidth: 80 }}>Email:</Typography>
                                <Typography fontWeight={500}>{user?.email}</Typography>
                            </Stack>
                            {user?.phone && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography color="text.secondary" sx={{ minWidth: 80 }}>Teléfono:</Typography>
                                    <Typography fontWeight={500}>{user?.phone}</Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => { logout(); navigate('/'); }}
                        sx={{ py: 1.5, px: 4, borderRadius: 3 }}
                    >
                        Cerrar Sesión
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
