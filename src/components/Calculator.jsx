import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Alert,
    Box,
    Backdrop,
    Button,
    Card,
    CircularProgress,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Avatar,
    Portal,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { HiArrowPath, HiMinus, HiGlobeAlt, HiChevronDown, HiChevronUp, HiLockClosed, HiBanknotes } from 'react-icons/hi2';

import api from '../services/api';

const DEFAULT_FEE = Number(import.meta.env.VITE_FEE || 0);

const nameFallbackByCode = {
    CLP: 'Chile',
    USD: 'Estados Unidos',
    EUR: 'Unión Europea',
    ARS: 'Argentina',
    BRL: 'Brasil',
    COP: 'Colombia',
    MXN: 'México',
    PEN: 'Perú',
    GBP: 'Reino Unido',
};

const localeByCode = {
    CLP: 'es-CL',
    USD: 'en-US',
    EUR: 'de-DE',
    ARS: 'es-AR',
    BRL: 'pt-BR',
    COP: 'es-CO',
    MXN: 'es-MX',
    PEN: 'es-PE',
    GBP: 'en-GB',
};

const formatMoney = (value, code) => {
    const locale = localeByCode[code] || 'es-CL';
    const amount = Number.isFinite(value) ? value : 0;
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: code || 'CLP',
            maximumFractionDigits: code === 'CLP' ? 0 : 2,
        }).format(amount);
    } catch (error) {
        const formatted = new Intl.NumberFormat(locale, {
            maximumFractionDigits: code === 'CLP' ? 0 : 2,
        }).format(amount);
        return `${formatted} ${code || ''}`.trim();
    }
};

const formatNumber = (value, code) => {
    const locale = localeByCode[code] || 'es-CL';
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: code === 'CLP' ? 0 : 2,
    }).format(Number.isFinite(value) ? value : 0);
};

const formatRate = (value, code) => {
    const locale = localeByCode[code] || 'es-CL';
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: code === 'CLP' ? 0 : 2,
        maximumFractionDigits: value < 1 ? 6 : (code === 'CLP' ? 0 : 2),
    }).format(Number.isFinite(value) ? value : 0);
};

export default function Calculator({ onNext, externalLoginOpen, setExternalLoginOpen }) {
    const location = useLocation();

    // Initialize from URL if available
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');
    const urlAmount = searchParams.get('amount');

    const [amountInput, setAmountInput] = useState(urlAmount || '50.000');
    const [isClosed, setIsClosed] = useState(false);
    const [from, setFrom] = useState(urlFrom || 'CLP');
    const [to, setTo] = useState(urlTo || 'USD');
    const [currencies, setCurrencies] = useState([]);
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    // Auth state
    const { user } = useAuth();

    useEffect(() => {
        let active = true;

        const fetchAll = async () => {
            try {
                setLoading(true);
                const [currenciesJson, ratesJson, statusJson] = await Promise.all([
                    api.get('/currencies'),
                    api.get('/rates'),
                    api.get('/status'),
                ]);

                if (!active) return;
                setCurrencies(currenciesJson || []);
                setRates(ratesJson || []);
                setIsClosed(statusJson?.open === false);

                if (currenciesJson?.length) {
                    const initialFrom = currenciesJson[0].code || 'CLP';
                    const initialTo = currenciesJson.find((item) => item.code !== initialFrom)?.code || initialFrom;
                    setFrom(initialFrom);
                    setTo(initialTo);
                }
            } catch (err) {
                if (!active) return;
                setError(err.message || 'No se pudo cargar la información.');
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchAll();
        return () => {
            active = false;
        };
    }, []);

    const rateDoc = useMemo(() => {
        if (!from || !to) return null;
        return rates.find((rate) => rate.from === from && rate.to === to && rate.enabled !== false) || null;
    }, [from, to, rates]);

    const currencyLabel = (code) => {
        const currency = currencies.find((item) => item.code === code);
        const name = currency?.name || nameFallbackByCode[code] || 'País';
        return `${code} — ${name}`;
    };

    const fromOptions = useMemo(
        () => currencies.filter((currency) => currency.code && currency.code !== from),
        [currencies, from],
    );

    const toOptions = useMemo(
        () => currencies.filter((currency) => currency.code && currency.code !== to),
        [currencies, to],
    );

    const parseAmount = (value) => {
        if (!value) return 0;
        const normalized = value.replace(/\./g, '').replace(',', '.');
        const number = Number(normalized);
        return Number.isFinite(number) ? number : 0;
    };

    const formatAmount = (value) => {
        if (!value) return '';
        const cleaned = value.replace(/[^\d,]/g, '');
        const [rawInt = '', rawDec = ''] = cleaned.split(',');
        const integerPart = rawInt.replace(/\D/g, '');
        const decimalPart = rawDec.replace(/\D/g, '').slice(0, 2);
        const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (cleaned.includes(',') && decimalPart === '') {
            return `${withThousands},`;
        }
        if (!withThousands && decimalPart) {
            return `0,${decimalPart}`;
        }
        return decimalPart ? `${withThousands},${decimalPart}` : withThousands;
    };

    const amountNumber = useMemo(() => parseAmount(amountInput), [amountInput]);

    const converted = useMemo(() => {
        if (!rateDoc) return 0;
        const baseAmount = Math.max(amountNumber - DEFAULT_FEE, 0);
        const operation = rateDoc.operation || 'multiply';
        if (operation === 'divide') {
            return rateDoc.rate ? baseAmount / rateDoc.rate : 0;
        }
        return baseAmount * rateDoc.rate;
    }, [amountNumber, rateDoc]);

    const exchangeLabel = useMemo(() => {
        if (!rateDoc) return '--';
        const rateValue = Number(rateDoc.rate) || 0;
        const operation = rateDoc.operation || 'multiply';
        if (operation === 'divide') {
            if (!rateValue) return '--';
            return `1 ${from} = ${formatRate(1 / rateValue, to)} ${to}`;
        }
        return `1 ${from} = ${formatRate(rateValue, to)} ${to}`;
    }, [rateDoc, from, to]);

    const feeLabel = formatMoney(DEFAULT_FEE, from);
    const amountToConvert = Math.max(amountNumber - DEFAULT_FEE, 0);
    const roundedConverted = Math.round(converted);

    const handleNext = () => {
        const calculationData = {
            from,
            to,
            amount: amountNumber,
            total: roundedConverted,
            rate: rateDoc?.rate,
            fee: DEFAULT_FEE
        };
        if (user) {
            onNext('owner_form', calculationData);
        } else {
            setExternalLoginOpen(true);
        }
    };

    // If user logs in while modal is open, we should close it and maybe proceed
    useEffect(() => {
        if (user && externalLoginOpen) {
            setExternalLoginOpen(false);
            const calculationData = {
                from,
                to,
                amount: amountNumber,
                total: roundedConverted,
                rate: rateDoc?.rate,
                fee: DEFAULT_FEE
            };
            onNext('owner_form', calculationData);
        }
    }, [user, externalLoginOpen, onNext, setExternalLoginOpen, from, to, amountNumber, roundedConverted, rateDoc?.rate]);


    return (
        <>
            <Portal>
                <Backdrop
                    open={loading}
                    sx={{
                        color: '#fff',
                        zIndex: 3000,
                        backdropFilter: 'blur(8px)',
                        bgcolor: 'rgba(221, 62, 0, 0.7)'
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress color="inherit" thickness={2} size={100} sx={{ opacity: 0.5 }} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: 'pulse-slow 2s infinite ease-in-out',
                                    '@keyframes pulse-slow': {
                                        '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
                                        '50%': { transform: 'scale(1.1)', opacity: 1 }
                                    }
                                }}
                            >
                                <HiBanknotes size={40} />
                            </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9 }}>
                            Obteniendo los mejores precios
                        </Typography>
                    </Stack>
                </Backdrop>
            </Portal>

            {isClosed && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 6
                    }}
                >
                    <HiLockClosed size={64} style={{ marginBottom: 24, opacity: 0.9 }} />
                    <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                        Estamos cerrados
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: 320 }}>
                        En este momento no estamos procesando envíos. Vuelve pronto.
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    position: 'relative',
                    py: { xs: 2, md: 4 },
                    filter: isClosed ? 'blur(12px) grayscale(40%)' : 'none',
                    pointerEvents: isClosed ? 'none' : 'auto',
                    userSelect: isClosed ? 'none' : 'auto',
                    transition: 'all 0.5s ease',
                }}
            >

                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 500, mx: 'auto' }}>
                    <Stack spacing={4}>
                        <Card sx={{ p: 0, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                            {/* Tu envías */}
                            <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: 'background.paper' }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'center' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Tu envías
                                        </Typography>
                                        <TextField
                                            type="text"
                                            value={amountInput}
                                            onChange={(event) => setAmountInput(formatAmount(event.target.value))}
                                            inputMode="decimal"
                                            variant="standard"
                                            fullWidth
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: { fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, color: 'primary.main' },
                                            }}
                                        />
                                    </Box>
                                    <FormControl sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <Select
                                            value={from}
                                            onChange={(event) => setFrom(event.target.value)}
                                            variant="standard"
                                            disableUnderline
                                            renderValue={(value) => (
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                                    <HiGlobeAlt size={18} />
                                                    <Typography fontWeight={700}>{value}</Typography>
                                                </Stack>
                                            )}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency._id || currency.code} value={currency.code}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <HiGlobeAlt />
                                                        <Typography fontWeight={600}>{currency.code} — {currency.name || nameFallbackByCode[currency.code]}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            <Box sx={{ height: '1px', bgcolor: 'rgba(0,0,0,0.06)', mx: 3 }} />

                            {/* Tu contacto recibe */}
                            <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: 'background.paper' }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'center' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Tu contacto recibe
                                        </Typography>
                                        <Typography variant="h3" color="text.primary" sx={{ fontWeight: 800 }}>
                                            {formatMoney(roundedConverted, to)}
                                        </Typography>
                                    </Box>
                                    <FormControl sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <Select
                                            value={to}
                                            onChange={(event) => setTo(event.target.value)}
                                            variant="standard"
                                            disableUnderline
                                            renderValue={(value) => (
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                                    <HiGlobeAlt size={18} />
                                                    <Typography fontWeight={700}>{value}</Typography>
                                                </Stack>
                                            )}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency._id || currency.code} value={currency.code}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <HiGlobeAlt />
                                                        <Typography fontWeight={600}>{currency.code} — {currency.name || nameFallbackByCode[currency.code]}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* Cost Details (Tablita) */}
                            <Box sx={{ p: 2.5, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Costo de envío:</Typography>
                                        <Typography variant="body2" fontWeight={700}>{feeLabel}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Tipo de cambio:</Typography>
                                        <Typography variant="body2" fontWeight={700}>{exchangeLabel}</Typography>
                                    </Stack>

                                    <Button
                                        onClick={() => setShowDetails((prev) => !prev)}
                                        size="small"
                                        startIcon={showDetails ? <HiChevronUp /> : <HiChevronDown />}
                                        sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0, fontSize: '0.75rem', opacity: 0.7 }}
                                    >
                                        {showDetails ? 'Ocultar detalles' : 'Más detalles'}
                                    </Button>

                                    {showDetails && (
                                        <Stack spacing={1} sx={{ pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">Monto a convertir:</Typography>
                                                <Typography variant="caption" fontWeight={600}>{formatMoney(amountToConvert, from)}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">Tasa aplicada:</Typography>
                                                <Typography variant="caption" fontWeight={600}>{rateDoc ? formatNumber(rateDoc.rate, to) : '--'}</Typography>
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Card>

                        <Button
                            onClick={handleNext}
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                borderRadius: 3,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                bgcolor: 'primary.main',
                                boxShadow: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? '0 18px 30px rgba(221, 62, 0, 0.3)'
                                        : '0 18px 30px rgba(0, 0, 0, 0.4)',
                            }}
                        >
                            Siguiente
                        </Button>


                        <Typography textAlign="center" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <HiLockClosed /> Sistema de envíos seguros. bnsglobalservices.com
                        </Typography>

                        <Stack spacing={1.5}>
                            {loading && <Alert severity="info">Cargando tasas...</Alert>}
                            {error && <Alert severity="error">{error}</Alert>}
                            {!loading && !error && !rateDoc && (
                                <Alert severity="warning">
                                    No hay tasa configurada para {from} → {to}.
                                </Alert>
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
