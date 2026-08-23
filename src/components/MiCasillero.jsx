import { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Typography, Card, Stack, Chip, Button, Checkbox, Divider,
    CircularProgress, TextField, MenuItem, Alert, IconButton, Tooltip, Grid
} from '@mui/material';
import { HiOutlineClipboardCopy, HiOutlineCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { HiOutlineArchiveBox, HiOutlineTruck, HiOutlineLockClosed } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CardPaymentForm from './CardPaymentForm';

const PACKAGE_STATUS = {
    received: { label: 'Recibido, listo para enviar', color: 'success' },
    requested_shipment: { label: 'En tu envío', color: 'info' },
    shipped: { label: 'En camino', color: 'warning' },
    delivered: { label: 'Entregado', color: 'default' },
};

const SHIPMENT_STATUS = {
    pending_payment: { label: 'Falta pagar', color: 'warning' },
    paid: { label: 'Pagado, preparando envío', color: 'info' },
    in_transit: { label: 'En camino a Venezuela', color: 'primary' },
    delivered: { label: 'Entregado', color: 'success' },
};

export default function MiCasillero({ onBack }) {
    const { user } = useAuth();
    const [casillero, setCasillero] = useState(null);
    const [packages, setPackages] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Request flow state
    const [selected, setSelected] = useState([]);
    const [view, setView] = useState('list'); // list | box | destination | payment
    const [boxPricing, setBoxPricing] = useState([]);
    const [boxSize, setBoxSize] = useState('');
    const [destination, setDestination] = useState({ firstName: '', lastName: '', docType: 'V', docNumber: '', phone: '', address: '', city: '', state: '' });
    const [shipmentId, setShipmentId] = useState(null);
    const [shipmentPrice, setShipmentPrice] = useState(0);
    const [formError, setFormError] = useState('');

    const loadAll = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [casilleroData, pkgs, ships, pricing] = await Promise.all([
                api.get(`/casillero?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}`),
                api.get(`/my-packages?email=${encodeURIComponent(user.email)}`),
                api.get(`/my-shipments?email=${encodeURIComponent(user.email)}`),
                api.get('/box-pricing'),
            ]);
            setCasillero(casilleroData);
            setPackages(Array.isArray(pkgs) ? pkgs : []);
            setShipments(Array.isArray(ships) ? ships : []);
            setBoxPricing(Array.isArray(pricing) ? pricing : []);
        } catch (err) {
            console.error('Error loading casillero:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, [user?.email]);

    const receivedPackages = useMemo(() => packages.filter(p => p.status === 'received'), [packages]);

    const addressText = useMemo(() => {
        if (!casillero) return '';
        const a = casillero.address;
        return `${a.line2}\n${a.line1}\n${a.city}, ${a.state} ${a.zip}\n${a.country}`;
    }, [casillero]);

    const handleCopy = () => {
        navigator.clipboard.writeText(addressText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleCreateShipment = async () => {
        try {
            const res = await api.post('/package-shipments', {
                email: user.email,
                name: user.name,
                phone: user.phone,
                packageIds: selected,
                boxSize,
                destination,
            });
            if (!res?.id) throw new Error(res?.errorMessage || 'No se pudo crear el envío');
            setShipmentId(res.id);
            setShipmentPrice(res.price);
            return res.id;
        } catch (err) {
            setFormError(err.message);
            throw err;
        }
    };

    const handlePaymentSuccess = () => {
        setView('done');
        setSelected([]);
        loadAll();
    };

    const destinationValid = destination.firstName && destination.lastName && destination.docNumber && destination.phone && destination.address && destination.city;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user?.email) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <HiOutlineLockClosed size={48} style={{ opacity: 0.4 }} />
                <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>Inicia sesión para ver tu casillero</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Necesitas una cuenta para tener tu dirección de casillero y registrar tus paquetes.
                </Typography>
                <Button variant="contained" onClick={onBack} sx={{ borderRadius: 3, py: 1.5, px: 4 }}>Volver al inicio</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Button startIcon={<HiArrowLeft />} onClick={onBack} sx={{ mb: 3, fontWeight: 700 }}>Volver</Button>

            <Typography variant="h4" fontWeight={800} gutterBottom>Mi Casillero</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Compra en Amazon o cualquier tienda de USA, envíalo a esta dirección, y nosotros lo reenviamos a tu familia en Venezuela.
            </Typography>

            {/* Address Card */}
            <Card sx={{ p: 4, borderRadius: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>Tu dirección de casillero</Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>Casillero #{casillero?.casilleroNumber}</Typography>
                        <Typography sx={{ whiteSpace: 'pre-line', mt: 1, lineHeight: 1.8 }}>{addressText}</Typography>
                    </Box>
                    <Tooltip title={copied ? '¡Copiado!' : 'Copiar dirección'}>
                        <IconButton onClick={handleCopy} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}>
                            {copied ? <HiOutlineCheckCircle /> : <HiOutlineClipboardCopy />}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Card>

            {view === 'list' && (
                <>
                    {/* Packages */}
                    <Typography variant="h6" fontWeight={700} gutterBottom>Tus paquetes</Typography>
                    {packages.length === 0 ? (
                        <Card sx={{ p: 4, borderRadius: 3, textAlign: 'center', color: 'text.secondary' }}>
                            <HiOutlineArchiveBox size={40} />
                            <Typography sx={{ mt: 1 }}>Aún no tienes paquetes registrados. En cuanto llegue uno a tu casillero, aparecerá aquí.</Typography>
                        </Card>
                    ) : (
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                            {packages.map(pkg => {
                                const st = PACKAGE_STATUS[pkg.status] || PACKAGE_STATUS.received;
                                return (
                                    <Card key={pkg._id} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {pkg.status === 'received' && (
                                            <Checkbox checked={selected.includes(pkg._id)} onChange={() => toggleSelect(pkg._id)} />
                                        )}
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography fontWeight={700}>{pkg.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Recibido: {new Date(pkg.receivedAt).toLocaleDateString('es-VE')}
                                                {pkg.weight ? ` · ${pkg.weight} lbs` : ''}
                                            </Typography>
                                        </Box>
                                        <Chip label={st.label} color={st.color} size="small" />
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    {receivedPackages.length > 0 && (
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={selected.length === 0}
                            onClick={() => setView('box')}
                            sx={{ borderRadius: 3, py: 1.5, mb: 5 }}
                        >
                            Solicitar reenvío ({selected.length} seleccionado{selected.length !== 1 ? 's' : ''})
                        </Button>
                    )}

                    {/* Shipments history */}
                    <Typography variant="h6" fontWeight={700} gutterBottom>Tus envíos</Typography>
                    {shipments.length === 0 ? (
                        <Typography color="text.secondary">Todavía no has solicitado ningún reenvío.</Typography>
                    ) : (
                        <Stack spacing={1.5}>
                            {shipments.map(s => {
                                const st = SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.pending_payment;
                                return (
                                    <Card key={s._id} sx={{ p: 2, borderRadius: 2 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography fontWeight={700}>Caja {s.boxSize} · {s.packages?.length || 0} paquete(s)</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ${s.price?.toFixed(2)} · {new Date(s.createdAt).toLocaleDateString('es-VE')}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip label={st.label} color={st.color} size="small" />
                                                {s.status === 'pending_payment' && (
                                                    <Button size="small" variant="outlined" onClick={() => { setShipmentId(s._id); setShipmentPrice(s.price); setView('payment'); }}>
                                                        Pagar
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}
                </>
            )}

            {view === 'box' && (
                <Card sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Elige el tamaño de caja</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Estás enviando {selected.length} paquete(s) juntos en una sola caja. Elige el tamaño que mejor le quede a lo que compraste.
                    </Typography>
                    <Grid container spacing={2}>
                        {boxPricing.map(b => (
                            <Grid item xs={6} sm={3} key={b.boxSize}>
                                <Card
                                    onClick={() => setBoxSize(b.boxSize)}
                                    sx={{
                                        p: 2, textAlign: 'center', cursor: 'pointer', borderRadius: 2,
                                        border: '2px solid', borderColor: boxSize === b.boxSize ? 'primary.main' : 'divider',
                                        bgcolor: boxSize === b.boxSize ? 'action.selected' : 'transparent',
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">{b.boxSize}</Typography>
                                    <Typography fontWeight={800} color="primary.main">${b.price}</Typography>
                                    <Typography variant="caption" color="text.secondary">{b.weightRange}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        <Button variant="outlined" fullWidth onClick={() => setView('list')} sx={{ borderRadius: 3, py: 1.5 }}>Atrás</Button>
                        <Button variant="contained" fullWidth disabled={!boxSize} onClick={() => setView('destination')} sx={{ borderRadius: 3, py: 1.5 }}>Siguiente</Button>
                    </Stack>
                </Card>
            )}

            {view === 'destination' && (
                <Card sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>¿A quién le llega en Venezuela?</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField label="Nombres" fullWidth value={destination.firstName} onChange={e => setDestination({ ...destination, firstName: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Apellidos" fullWidth value={destination.lastName} onChange={e => setDestination({ ...destination, lastName: e.target.value })} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField select label="Tipo doc." fullWidth value={destination.docType} onChange={e => setDestination({ ...destination, docType: e.target.value })}>
                                {['V', 'E', 'J', 'P'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField label="Número de documento" fullWidth value={destination.docNumber} onChange={e => setDestination({ ...destination, docNumber: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Teléfono" fullWidth value={destination.phone} onChange={e => setDestination({ ...destination, phone: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Dirección" fullWidth value={destination.address} onChange={e => setDestination({ ...destination, address: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Ciudad" fullWidth value={destination.city} onChange={e => setDestination({ ...destination, city: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Estado" fullWidth value={destination.state} onChange={e => setDestination({ ...destination, state: e.target.value })} />
                        </Grid>
                    </Grid>
                    {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        <Button variant="outlined" fullWidth onClick={() => setView('box')} sx={{ borderRadius: 3, py: 1.5 }}>Atrás</Button>
                        <Button variant="contained" fullWidth disabled={!destinationValid} onClick={() => setView('payment')} sx={{ borderRadius: 3, py: 1.5 }}>
                            Continuar al pago
                        </Button>
                    </Stack>
                </Card>
            )}

            {view === 'payment' && (
                <Card sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Pagar el reenvío</Typography>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                    <CardPaymentForm
                        amount={shipmentId ? shipmentPrice : boxPricing.find(b => b.boxSize === boxSize)?.price}
                        createEntity={shipmentId ? async () => shipmentId : handleCreateShipment}
                        paymentEndpoint="/payments/create-shipment-intent"
                        buildPaymentBody={(id) => ({ shipmentId: id })}
                        onSuccess={handlePaymentSuccess}
                        onBack={() => setView(shipmentId ? 'list' : 'destination')}
                    />
                </Card>
            )}

            {view === 'done' && (
                <Card sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
                    <Box sx={{ color: 'success.main', mb: 2 }}><HiOutlineTruck size={56} /></Box>
                    <Typography variant="h5" fontWeight={800} gutterBottom>¡Pago confirmado!</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>Ya estamos preparando tu caja para enviarla a Venezuela.</Typography>
                    <Button variant="contained" onClick={() => setView('list')} sx={{ borderRadius: 3 }}>Volver a Mi Casillero</Button>
                </Card>
            )}
        </Container>
    );
}
