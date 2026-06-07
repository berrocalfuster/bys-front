import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    keyframes
} from '@mui/material';
import {
    HiXMark,
    HiShieldCheck,
    HiExclamationTriangle,
    HiClock,
    HiArrowLeft,
    HiIdentification
} from 'react-icons/hi2';
import { MdVerified, MdFingerprint, MdPhotoCamera } from 'react-icons/md';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(46, 125, 50, 0); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export default function KycVerification() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'none');
    const [kycVerifiedAt, setKycVerifiedAt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sdkOpen, setSdkOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [tokenLoading, setTokenLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch current KYC status
    const fetchKycStatus = useCallback(async () => {
        if (!user?.email) return;
        try {
            const data = await api.get('/kyc/status', { params: { email: user.email } });
            setKycStatus(data.kycStatus);
            setKycVerifiedAt(data.kycVerifiedAt);
            updateUser({ kycStatus: data.kycStatus });
        } catch (err) {
            console.error('Error fetching KYC status:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchKycStatus();
    }, [fetchKycStatus]);

    // Poll for status when pending
    useEffect(() => {
        if (kycStatus !== 'pending') return;
        const interval = setInterval(fetchKycStatus, 10000); // every 10 seconds
        return () => clearInterval(interval);
    }, [kycStatus, fetchKycStatus]);

    const handleStartVerification = async () => {
        setTokenLoading(true);
        setError('');
        try {
            const data = await api.post('/kyc/access-token', { email: user.email });
            setAccessToken(data.token);
            setSdkOpen(true);
        } catch (err) {
            setError(err.message || 'Error al iniciar la verificación');
        } finally {
            setTokenLoading(false);
        }
    };

    const handleSdkMessage = (type, payload) => {
        console.log('Sumsub SDK Message:', type, payload);
        if (type === 'idCheck.onApplicantSubmitted') {
            setKycStatus('pending');
            updateUser({ kycStatus: 'pending' });
        }
        if (type === 'idCheck.onApplicantResubmitted') {
            setKycStatus('pending');
            updateUser({ kycStatus: 'pending' });
        }
    };

    const handleSdkError = (error) => {
        console.error('Sumsub SDK Error:', error);
        setError('Ocurrió un error en el proceso de verificación.');
    };

    const handleTokenExpiration = async () => {
        try {
            const data = await api.post('/kyc/access-token', { email: user.email });
            return data.token;
        } catch (err) {
            console.error('Error refreshing token:', err);
            return null;
        }
    };

    const handleCloseSdk = () => {
        setSdkOpen(false);
        setAccessToken(null);
        fetchKycStatus();
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    const statusConfig = {
        none: {
            color: '#6366f1',
            bgGradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            icon: <HiIdentification size={80} />,
            title: 'Verifica tu identidad',
            description: 'Completa el proceso de verificación KYC para desbloquear todos los beneficios y aumentar tus límites de operación.',
            chipLabel: 'No verificado',
            chipColor: 'default'
        },
        pending: {
            color: '#f59e0b',
            bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            icon: <HiClock size={80} />,
            title: 'Verificación en proceso',
            description: 'Estamos revisando tu documentación. Este proceso puede tardar unos minutos. Te notificaremos cuando esté listo.',
            chipLabel: 'En revisión',
            chipColor: 'warning'
        },
        approved: {
            color: '#16a34a',
            bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            icon: <MdVerified size={80} />,
            title: '¡Identidad Verificada!',
            description: 'Tu identidad ha sido verificada exitosamente. Ya puedes disfrutar de todos los beneficios y límites ampliados.',
            chipLabel: 'Verificado',
            chipColor: 'success'
        },
        rejected: {
            color: '#dc2626',
            bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            icon: <HiExclamationTriangle size={80} />,
            title: 'Verificación rechazada',
            description: 'No pudimos verificar tu identidad. Por favor, intenta nuevamente asegurándote de que los documentos sean legibles y vigentes.',
            chipLabel: 'Rechazado',
            chipColor: 'error'
        }
    };

    const currentStatus = statusConfig[kycStatus] || statusConfig.none;

    const benefits = [
        { icon: <MdFingerprint size={28} />, title: 'Mayor seguridad', desc: 'Protección adicional para tu cuenta' },
        { icon: <MdPhotoCamera size={28} />, title: 'Proceso rápido', desc: 'Solo necesitas tu documento y una selfie' },
        { icon: <HiShieldCheck size={28} />, title: 'Límites ampliados', desc: 'Accede a montos más altos por operación' },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <Button
                    startIcon={<HiArrowLeft />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 4, fontWeight: 700, color: 'text.secondary' }}
                >
                    Volver al inicio
                </Button>

                {/* Main Status Card */}
                <Card sx={{
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    mb: 4
                }}>
                    {/* Hero Section */}
                    <Box sx={{
                        background: currentStatus.bgGradient,
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative circles */}
                        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: `${currentStatus.color}10` }} />
                        <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: `${currentStatus.color}08` }} />

                        <Box sx={{
                            color: currentStatus.color,
                            mb: 3,
                            display: 'inline-flex',
                            animation: kycStatus === 'approved' ? `${pulseGlow} 2s infinite` : kycStatus === 'pending' ? `${floatAnimation} 3s ease-in-out infinite` : 'none',
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: `${currentStatus.color}15`,
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {currentStatus.icon}
                        </Box>

                        <Chip
                            label={currentStatus.chipLabel}
                            color={currentStatus.chipColor}
                            sx={{ mb: 2, fontWeight: 800, px: 1 }}
                        />

                        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                            {currentStatus.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', position: 'relative', zIndex: 1 }}>
                            {currentStatus.description}
                        </Typography>

                        {kycVerifiedAt && kycStatus === 'approved' && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                Verificado el {new Date(kycVerifiedAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </Typography>
                        )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                        {(kycStatus === 'none' || kycStatus === 'rejected') && (
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleStartVerification}
                                disabled={tokenLoading}
                                startIcon={tokenLoading ? <CircularProgress size={20} color="inherit" /> : <HiIdentification />}
                                sx={{
                                    borderRadius: 4,
                                    py: 2,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    background: kycStatus === 'rejected'
                                        ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {kycStatus === 'rejected' ? 'Reintentar verificación' : 'Comenzar verificación'}
                            </Button>
                        )}

                        {kycStatus === 'pending' && (
                            <Box sx={{ textAlign: 'center' }}>
                                <CircularProgress size={32} sx={{ mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Consultando estado automáticamente...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* Benefits Section */}
                {(kycStatus === 'none' || kycStatus === 'rejected') && (
                    <Card sx={{
                        borderRadius: 5,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        p: { xs: 3, md: 4 }
                    }}>
                        <Typography variant="overline" fontWeight={800} color="primary" gutterBottom sx={{ display: 'block' }}>
                            ¿Por qué verificarte?
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                            Beneficios de la verificación
                        </Typography>
                        <Stack spacing={3}>
                            {benefits.map((b, i) => (
                                <Stack key={i} direction="row" spacing={2.5} alignItems="center">
                                    <Box sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        bgcolor: 'action.hover',
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: 'primary.main',
                                        flexShrink: 0
                                    }}>
                                        {b.icon}
                                    </Box>
                                    <Box>
                                        <Typography fontWeight={700}>{b.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{b.desc}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Card>
                )}
            </Container>

            {/* Sumsub SDK Dialog */}
            <Dialog
                open={sdkOpen}
                onClose={handleCloseSdk}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        minHeight: '70vh',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <HiShieldCheck size={24} color="#6366f1" />
                        <Typography fontWeight={800}>Verificación de Identidad</Typography>
                    </Stack>
                    <IconButton onClick={handleCloseSdk} sx={{ bgcolor: 'action.hover' }}>
                        <HiXMark />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, overflow: 'auto' }}>
                    {accessToken && (
                        <Box sx={{ minHeight: 500 }}>
                            <SumsubWebSdk
                                accessToken={accessToken}
                                expirationHandler={handleTokenExpiration}
                                config={{
                                    lang: 'es',
                                    uiConf: {
                                        customCssStr: `
                                            * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
                                            .sumsub-logo { display: none !important; }
                                        `
                                    }
                                }}
                                options={{ addViewportTag: false, adaptIframeHeight: true }}
                                onMessage={handleSdkMessage}
                                onError={handleSdkError}
                            />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
