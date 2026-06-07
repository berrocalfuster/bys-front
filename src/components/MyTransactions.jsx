import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Chip,
    Grid,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    Pagination,
    Skeleton,
    Avatar,
    Step,
    Stepper,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled
} from '@mui/material';
import { 
    HiMagnifyingGlass, 
    HiCalendar, 
    HiAdjustmentsHorizontal, 
    HiXMark,
    HiEye,
    HiArrowRight,
    HiClock,
    HiCheckCircle,
    HiXCircle,
    HiReceiptPercent
} from 'react-icons/hi2';
import { MdSwapHoriz } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
    all: { label: 'Todas', color: 'default' },
    pending: { label: 'Pendiente', color: 'warning', icon: <HiClock /> },
    approved: { label: 'Aceptada', color: 'info', icon: <HiCheckCircle /> },
    rejected: { label: 'Rechazada', color: 'error', icon: <HiXCircle /> },
    completed: { label: 'Completada', color: 'success', icon: <HiCheckCircle /> }
};

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));
  
  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.palette.primary.main,
    }),
    '& .QontoStepIcon-completedIcon': {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }));
  
  function QontoStepIcon(props) {
    const { active, completed, className } = props;
  
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <HiCheckCircle className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

export default function MyTransactions() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Detail Dialog
    const [selectedId, setSelectedId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchTransactions = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const data = await api.get(`/solicitudes-user`, {
                params: {
                    email: user.email,
                    status: statusFilter,
                    startDate,
                    endDate,
                    search: searchQuery,
                    page,
                    limit: 6
                }
            });
            setSolicitudes(data.solicitudes || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user?.email, page, statusFilter, startDate, endDate]);

    // Debounced search could be better, but for now simple manual or enter trigger
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchTransactions();
        }
    };

    const handleOpenDetail = (sol) => {
        setDetail(sol);
        setSelectedId(sol._id);
    };

    const formatMoney = (amount, currency) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatusChip = ({ status }) => {
        const config = STATUS_MAP[status] || STATUS_MAP.pending;
        return (
            <Chip 
                icon={config.icon}
                label={config.label} 
                color={config.color} 
                size="small" 
                sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
            />
        );
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="lg">
                
                {/* Header Section */}
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 6 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                            Mis Transacciones
                        </Typography>
                        <Typography color="text.secondary" fontWeight={500}>
                            Gestiona y revisa el historial de todas tus operaciones.
                        </Typography>
                    </Box>
                    <Chip 
                        label={`${total} Operaciones`} 
                        variant="outlined" 
                        sx={{ bgcolor: 'background.paper', fontWeight: 800, py: 2.5, px: 1, borderRadius: 3, borderColor: 'divider' }} 
                    />
                </Stack>

                {/* Filters Section */}
                <Card sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField 
                                fullWidth
                                placeholder="Buscar por destinatario o cuenta..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                InputProps={{
                                    startAdornment: <HiMagnifyingGlass style={{ marginRight: 8, opacity: 0.5 }} />,
                                }}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Estado"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    sx={{ borderRadius: 3 }}
                                >
                                    {Object.entries(STATUS_MAP).map(([key, value]) => (
                                        <MenuItem key={key} value={key}>{value.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField 
                                fullWidth
                                type="date"
                                label="Desde"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField 
                                fullWidth
                                type="date"
                                label="Hasta"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={() => { setPage(1); fetchTransactions(); }}
                                sx={{ borderRadius: 3, fontWeight: 700, py: 1 }}
                            >
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                {/* List Section */}
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Grid item xs={12} md={6} key={i}>
                                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : solicitudes.length > 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {solicitudes.map((sol) => (
                                <Grid item xs={12} md={6} key={sol._id}>
                                    <Card sx={{ 
                                        p: 0, 
                                        borderRadius: 4, 
                                        border: '1px solid', 
                                        borderColor: 'divider', 
                                        boxShadow: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                                            borderColor: 'primary.main'
                                        }
                                    }}>
                                        <Box sx={{ p: 3 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                                        {formatDate(sol.createdAt)}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={800} mt={0.5}>
                                                        {sol.owner?.firstName || 'Sin nombre'} {sol.owner?.lastName || ''}
                                                    </Typography>
                                                </Box>
                                                <StatusChip status={sol.status} />
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 3, mb: 2 }}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Enviado</Typography>
                                                    <Typography variant="body1" fontWeight={700}>{formatMoney(sol.amount, sol.from)}</Typography>
                                                </Box>
                                                <MdSwapHoriz size={24} style={{ opacity: 0.3 }} />
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Recibe</Typography>
                                                    <Typography variant="body1" fontWeight={700} color="primary.main">{formatMoney(sol.total, sol.to)}</Typography>
                                                </Box>
                                            </Stack>

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'divider' }}>
                                                        {sol.bank?.bank?.charAt(0).toUpperCase() || 'B'}
                                                    </Avatar>
                                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                        {sol.bank?.bank?.toUpperCase() || 'BANCO'} • {sol.bank?.accountNumber?.slice(-4) || '****'}
                                                    </Typography>
                                                </Stack>
                                                <Button 
                                                    size="small" 
                                                    endIcon={<HiEye />} 
                                                    onClick={() => handleOpenDetail(sol)}
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    Ver detalle
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                            <Pagination 
                                count={pages} 
                                page={page} 
                                onChange={(e, v) => setPage(v)} 
                                color="primary" 
                                size="large"
                                sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 2 } }}
                            />
                        </Box>
                    </>
                ) : (
                    <Box sx={{ 
                        py: 12, 
                        textAlign: 'center', 
                        bgcolor: 'background.paper', 
                        borderRadius: 8, 
                        border: '1px dashed', 
                        borderColor: 'divider' 
                    }}>
                        <HiReceiptPercent size={80} style={{ opacity: 0.1, marginBottom: 24 }} />
                        <Typography variant="h5" fontWeight={800} gutterBottom>Sin transacciones aún</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                            Parece que todavía no has realizado ninguna transferencia. ¡Tus envíos aparecerán aquí!
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => navigate('/')}
                            sx={{ borderRadius: 99, px: 6, py: 1.5, fontWeight: 800 }}
                        >
                            Comenzar ahora
                        </Button>
                    </Box>
                )}
            </Container>

            {/* Detail Dialog */}
            <Dialog 
                open={!!detail} 
                onClose={() => setDetail(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
            >
                {detail && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, px: 4 }}>
                            <Box>
                                <Typography variant="h5" fontWeight={900}>Detalle de Operación</Typography>
                                <Typography variant="caption" color="text.secondary">REF: {detail._id.toUpperCase()}</Typography>
                            </Box>
                            <IconButton onClick={() => setDetail(null)} sx={{ bgcolor: 'action.hover' }}>
                                <HiXMark />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ px: 4, py: 2 }}>
                            <Stack spacing={4}>
                                
                                {/* Status Timeline Section */}
                                <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 4 }}>
                                    <Typography variant="overline" color="primary" fontWeight={800} gutterBottom sx={{ display: 'block', mb: 2 }}>Línea de tiempo</Typography>
                                    <Stepper 
                                        activeStep={(detail.statusHistory || []).length} 
                                        orientation="vertical" 
                                        connector={<QontoConnector />}
                                        sx={{ 
                                            '& .MuiStep-root': { pb: 1 },
                                            '& .MuiStepLabel-label': { fontWeight: 700 }
                                        }}
                                    >
                                        {(detail.statusHistory || []).map((step, index) => (
                                            <Step key={index} active={true} completed={true}>
                                                <StepLabel StepIconComponent={QontoStepIcon}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {STATUS_MAP[step.status]?.label || step.status.toUpperCase()}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(step.createdAt)}
                                                        </Typography>
                                                    </Stack>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                        {/* Current status if not in history or just to show the final state better */}
                                        {!(detail.statusHistory || []).some(s => s.status === detail.status) && (
                                             <Step active={true}>
                                                <StepLabel StepIconComponent={QontoStepIcon}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {STATUS_MAP[detail.status]?.label || detail.status.toUpperCase()}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Actual
                                                        </Typography>
                                                    </Stack>
                                                </StepLabel>
                                            </Step>
                                        )}
                                    </Stepper>
                                </Box>

                                {/* Amounts */}
                                <Box>
                                    <Typography variant="overline" color="primary" fontWeight={800} gutterBottom sx={{ display: 'block' }}>Resumen Económico</Typography>
                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="text.secondary">Monto enviado:</Typography>
                                            <Typography fontWeight={700}>{formatMoney(detail.amount, detail.from)}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="text.secondary">Tasa aplicada:</Typography>
                                            <Typography fontWeight={700}>{detail.rate}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography color="text.secondary">Comisión (Fee):</Typography>
                                            <Typography fontWeight={700}>{formatMoney(detail.fee, detail.from)}</Typography>
                                        </Stack>
                                        <Divider />
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="h6" fontWeight={800}>Monto a recibir:</Typography>
                                            <Typography variant="h6" fontWeight={900} color="primary.main">{formatMoney(detail.total, detail.to)}</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Destinatario */}
                                <Box>
                                    <Typography variant="overline" color="primary" fontWeight={800} gutterBottom sx={{ display: 'block' }}>Destinatario</Typography>
                                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                                        <Typography variant="h6" fontWeight={800}>{detail.owner?.firstName || 'Sin nombre'} {detail.owner?.lastName || ''}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {detail.owner?.docType || 'DOC'}: {detail.owner?.docNumber || 'N/A'}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ p: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                <Typography variant="body2" fontWeight={700}>{detail.bank?.bank?.toUpperCase() || 'BANCO'}</Typography>
                                            </Box>
                                            <Typography variant="body2">{detail.bank?.accountNumber || 'N/A'}</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Proof Image */}
                                {detail.imageUrl && (
                                    <Box>
                                        <Typography variant="overline" color="primary" fontWeight={800} gutterBottom sx={{ display: 'block' }}>Tu Comprobante</Typography>
                                        <Box 
                                            component="img" 
                                            src={detail.imageUrl} 
                                            sx={{ 
                                                width: '100%', 
                                                height: 200, 
                                                objectFit: 'cover', 
                                                borderRadius: 4, 
                                                mt: 1,
                                                cursor: 'pointer',
                                                '&:hover': { opacity: 0.9 }
                                            }} 
                                            onClick={() => window.open(detail.imageUrl, '_blank')}
                                        />
                                    </Box>
                                )}

                                {/* Admin Proof Image */}
                                {detail.transferImageUrl && detail.transferImageUrl !== detail.imageUrl && (
                                    <Box>
                                        <Typography variant="overline" color="success.main" fontWeight={800} gutterBottom sx={{ display: 'block' }}>Comprobante de Pago (Remesas BYS)</Typography>
                                        <Box 
                                            component="img" 
                                            src={detail.transferImageUrl} 
                                            sx={{ 
                                                width: '100%', 
                                                height: 200, 
                                                objectFit: 'cover', 
                                                borderRadius: 4, 
                                                mt: 1,
                                                cursor: 'pointer',
                                                '&:hover': { opacity: 0.9 },
                                                border: '2px solid',
                                                borderColor: 'success.light'
                                            }} 
                                            onClick={() => window.open(detail.transferImageUrl, '_blank')}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 4, pt: 0 }}>
                            <Button fullWidth variant="outlined" size="large" onClick={() => setDetail(null)} sx={{ borderRadius: 3, py: 1.5 }}>
                                Cerrar Ventana
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
