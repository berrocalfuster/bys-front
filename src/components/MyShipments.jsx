import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Chip,
    Grid,
    Button,
    Skeleton,
} from '@mui/material';
import { HiOutlineLockClosed, HiOutlineBanknotes, HiOutlineArchiveBox, HiArrowRight } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { STATUS_MAP } from './MyTransactions';
import { SHIPMENT_STATUS } from './MiCasillero';

const IN_PROGRESS_STATUSES = new Set(['pending', 'approved', 'pending_payment', 'paid', 'in_transit']);
const DONE_STATUSES = new Set(['completed', 'delivered']);

const formatMoney = (amount, currency) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 2 }).format(amount || 0);
    } catch {
        return `$${(amount || 0).toFixed(2)} ${currency || ''}`.trim();
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function MyShipments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [remesas, setRemesas] = useState([]);
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) { setLoading(false); return; }
        let active = true;
        setLoading(true);
        Promise.all([
            api.get('/solicitudes-user', { params: { limit: 100 } }).catch(() => ({ solicitudes: [] })),
            api.get('/my-shipments').catch(() => []),
        ]).then(([solicitudesRes, shipments]) => {
            if (!active) return;
            setRemesas(solicitudesRes?.solicitudes || []);
            setPaquetes(Array.isArray(shipments) ? shipments : []);
        }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [user?.email]);

    const items = useMemo(() => {
        const remesaItems = remesas.map((s) => ({
            type: 'remesa',
            id: s._id,
            date: s.createdAt,
            status: s.status,
            statusInfo: STATUS_MAP[s.status] || STATUS_MAP.pending,
            title: [s.owner?.firstName, s.owner?.lastName].filter(Boolean).join(' ') || 'Remesa',
            subtitle: `${formatMoney(s.amount, s.from)} → ${formatMoney(s.total, s.to)}`,
        }));
        const paqueteItems = paquetes.map((s) => ({
            type: 'paquete',
            id: s._id,
            date: s.createdAt,
            status: s.status,
            statusInfo: SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.pending_payment,
            title: `Caja ${s.boxSize}`,
            subtitle: `${s.packages?.length || 0} paquete(s) · ${formatMoney(s.price)}`,
        }));
        return [...remesaItems, ...paqueteItems].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [remesas, paquetes]);

    const counts = useMemo(() => ({
        total: items.length,
        enProceso: items.filter((i) => IN_PROGRESS_STATUSES.has(i.status)).length,
        completados: items.filter((i) => DONE_STATUSES.has(i.status)).length,
    }), [items]);

    if (!user?.email) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <HiOutlineLockClosed size={48} style={{ opacity: 0.4 }} />
                <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>Inicia sesión para ver tus envíos</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Aquí verás juntas tus remesas y tus paquetes, con su estado más reciente.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: 3, py: 1.5, px: 4 }}>Volver al inicio</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                    Mis Envíos
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Tus remesas y paquetes, juntos en un solo lugar.
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: 'Total', value: counts.total },
                        { label: 'En proceso', value: counts.enProceso },
                        { label: 'Completados', value: counts.completados },
                    ].map((stat) => (
                        <Grid item xs={4} key={stat.label}>
                            <Card sx={{ p: 2.5, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={900} color="primary.main">{stat.value}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                    {stat.label}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {loading ? (
                    <Stack spacing={2}>
                        {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={90} sx={{ borderRadius: 3 }} />)}
                    </Stack>
                ) : items.length === 0 ? (
                    <Card sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography>Todavía no tienes remesas ni paquetes registrados.</Typography>
                    </Card>
                ) : (
                    <Stack spacing={1.5}>
                        {items.map((item) => (
                            <Card
                                key={`${item.type}-${item.id}`}
                                onClick={() => navigate(item.type === 'remesa' ? '/transactions' : '/casillero')}
                                sx={{
                                    p: 2.5, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                                    '&:hover': { borderColor: 'primary.main' },
                                }}
                            >
                                <Box sx={{
                                    width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: 'action.hover', color: 'primary.main', flexShrink: 0,
                                }}>
                                    {item.type === 'remesa' ? <HiOutlineBanknotes size={22} /> : <HiOutlineArchiveBox size={22} />}
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography fontWeight={700} noWrap>{item.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(item.date)} · {item.subtitle}
                                    </Typography>
                                </Box>
                                <Chip label={item.statusInfo.label} color={item.statusInfo.color} size="small" sx={{ fontWeight: 700 }} />
                                <HiArrowRight style={{ opacity: 0.4, flexShrink: 0 }} />
                            </Card>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
