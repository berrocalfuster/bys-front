import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    Grid,
    Stack,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { HiOutlineTruck, HiOutlinePaperAirplane, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const WEIGHT_LABELS = {
    '10-40 lbs': { title: '10 – 40 lbs', sub: '4.5 – 18 kg' },
    '41-65 lbs': { title: '41 – 65 lbs', sub: '18.6 – 29.5 kg' },
};

const METHODS = {
    maritimo: { label: 'Marítimo', icon: <HiOutlineTruck size={18} />, eta: 'Entrega en 6 a 8 semanas hábiles. Salida cada viernes.' },
    aereo: { label: 'Aéreo', icon: <HiOutlinePaperAirplane size={18} />, eta: 'Entrega en 9 a 20 días hábiles.' },
};

export default function PaqueteriaCalculator({ onRequireLogin }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [weightRange, setWeightRange] = useState(null);
    const [boxSize, setBoxSize] = useState(null);
    const [method, setMethod] = useState('maritimo');

    useEffect(() => {
        let active = true;
        api.get('/box-pricing')
            .then((data) => { if (active) setPricing(Array.isArray(data) ? data : []); })
            .catch((err) => { if (active) setError(err.message || 'No se pudieron cargar las tarifas.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const weightOptions = useMemo(
        () => [...new Set(pricing.map((b) => b.weightRange))],
        [pricing],
    );

    const boxOptions = useMemo(
        () => pricing.filter((b) => b.weightRange === weightRange),
        [pricing, weightRange],
    );

    const selectedBox = useMemo(
        () => pricing.find((b) => b.boxSize === boxSize) || null,
        [pricing, boxSize],
    );

    const handleSelectWeight = (range) => {
        setWeightRange(range);
        if (!pricing.find((b) => b.weightRange === range && b.boxSize === boxSize)) {
            setBoxSize(null);
        }
    };

    const handleCasillero = () => {
        if (user) navigate('/casillero');
        else onRequireLogin?.();
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 4, md: 10 } }}>
            <Container maxWidth="sm">
                <Typography
                    variant="overline"
                    sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.5 }}
                >
                    Calculadora
                </Typography>
                <Typography variant="h3" fontWeight={900} gutterBottom>
                    Calcula tu envío de paquetería
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 5 }}>
                    Elige el peso, la caja y el método de envío para ver el precio exacto hacia Venezuela.
                </Typography>

                {loading && (
                    <Stack alignItems="center" sx={{ py: 8 }}>
                        <CircularProgress />
                    </Stack>
                )}

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {!loading && !error && (
                    <Card sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                            1. Rango de peso
                        </Typography>
                        <Grid container spacing={1.5} sx={{ mb: 3 }}>
                            {weightOptions.map((range) => {
                                const info = WEIGHT_LABELS[range] || { title: range, sub: '' };
                                const selected = weightRange === range;
                                return (
                                    <Grid item xs={6} key={range}>
                                        <Card
                                            onClick={() => handleSelectWeight(range)}
                                            sx={{
                                                p: 2, cursor: 'pointer', textAlign: 'center',
                                                border: '2px solid', borderColor: selected ? 'primary.main' : 'divider',
                                                bgcolor: selected ? 'action.selected' : 'transparent',
                                            }}
                                        >
                                            <Typography fontWeight={800}>{info.title}</Typography>
                                            {info.sub && <Typography variant="caption" color="text.secondary">{info.sub}</Typography>}
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                            2. Tamaño de caja
                        </Typography>
                        {!weightRange ? (
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Elige primero un rango de peso.
                            </Typography>
                        ) : (
                            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                                {boxOptions.map((b) => {
                                    const selected = boxSize === b.boxSize;
                                    return (
                                        <Grid item xs={6} key={b.boxSize}>
                                            <Card
                                                onClick={() => setBoxSize(b.boxSize)}
                                                sx={{
                                                    p: 2, cursor: 'pointer', textAlign: 'center',
                                                    border: '2px solid', borderColor: selected ? 'primary.main' : 'divider',
                                                    bgcolor: selected ? 'action.selected' : 'transparent',
                                                }}
                                            >
                                                <Typography variant="caption" color="text.secondary">{b.boxSize}</Typography>
                                                <Typography fontWeight={800} color="primary.main">${b.price}</Typography>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}

                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                            3. Método de envío
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
                            {Object.entries(METHODS).map(([key, info]) => {
                                const selected = method === key;
                                return (
                                    <Card
                                        key={key}
                                        onClick={() => setMethod(key)}
                                        sx={{
                                            flex: 1, p: 2, cursor: 'pointer', textAlign: 'center',
                                            border: '2px solid', borderColor: selected ? 'primary.main' : 'divider',
                                            bgcolor: selected ? 'action.selected' : 'transparent',
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                            {info.icon}
                                            <Typography fontWeight={700}>{info.label}</Typography>
                                        </Stack>
                                    </Card>
                                );
                            })}
                        </Stack>

                        {selectedBox ? (
                            <Box sx={{ pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography color="text.secondary">Caja</Typography>
                                    <Typography fontWeight={700}>{selectedBox.boxSize}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography color="text.secondary">Método</Typography>
                                    <Typography fontWeight={700}>{METHODS[method].label}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2 }}>
                                    <Typography variant="h6" fontWeight={800}>Total</Typography>
                                    <Typography variant="h4" fontWeight={900} color="primary.main">
                                        ${selectedBox.price.toFixed(2)}
                                    </Typography>
                                </Stack>
                                <Alert severity="info" icon={<HiOutlineShieldCheck size={20} />} sx={{ mb: 3 }}>
                                    {METHODS[method].eta} Gasto de manejo y seguro incluidos — tu familia no paga nada al recibir.
                                </Alert>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleCasillero}
                                    sx={{ borderRadius: 3, py: 1.5 }}
                                >
                                    {user ? 'Registrar mi paquete en Mi Casillero' : 'Inicia sesión para registrar tu paquete'}
                                </Button>
                            </Box>
                        ) : (
                            <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                                Selecciona peso y caja para ver el precio.
                            </Typography>
                        )}
                    </Card>
                )}
            </Container>
        </Box>
    );
}
