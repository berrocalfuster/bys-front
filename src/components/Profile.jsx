import { Box, Button, Typography, Container, Stack, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', pt: { xs: 4, md: 8 } }}>
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

                    <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            fullWidth
                            sx={{ py: 1.5, borderRadius: 3, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                        >
                            Nueva Transferencia
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => { logout(); navigate('/'); }}
                            fullWidth
                            sx={{ py: 1.5, borderRadius: 3 }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Stack>
                    <Button variant="text" onClick={() => navigate('/')}>Volver al inicio</Button>
                </Stack>
            </Container>
        </Box>
    );
}
