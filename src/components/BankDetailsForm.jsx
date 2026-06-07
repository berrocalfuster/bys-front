import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import api from '../services/api';

// Inline SVG ArrowLeft
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);


export default function BankDetailsForm({ onNext, onBack, initialData = {} }) {
    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(true);

    const isPmInit = initialData.isPagoMovil === 'si';
    const [formData, setFormData] = useState({
        bank: initialData.bank || '',
        isPagoMovil: initialData.isPagoMovil || 'no',
        accountType: initialData.accountType || '',
        accountNumber: isPmInit && initialData.accountNumber?.length > 4
            ? initialData.accountNumber.substring(4)
            : (initialData.accountNumber || ''),
        phonePrefix: isPmInit && initialData.accountNumber?.length >= 4
            ? initialData.accountNumber.substring(0, 4)
            : '0414',
    });
    const [accountError, setAccountError] = useState('');

    const selectedBank = useMemo(() => {
        return banks.find(b => b.slug === formData.bank) || null;
    }, [banks, formData.bank]);

    useEffect(() => {
        api.get('/status')
            .then(res => {
                if (res?.supportedBanks) {
                    setBanks(res.supportedBanks.filter(b => b.isActive));
                }
            })
            .catch(err => console.error('Error fetching banks:', err))
            .finally(() => setLoadingBanks(false));
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'accountNumber' || name === 'bank') {
            setAccountError('');
        }

        if (name === 'accountNumber') {
            const numeric = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numeric }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePagoMovilChange = (event) => {
        const isPm = event.target.value;
        setAccountError('');
        setFormData(prev => ({
            ...prev,
            isPagoMovil: isPm,
            accountType: isPm === 'si' ? 'pagomovil' : '',
            accountNumber: '',
            phonePrefix: isPm === 'si' ? (prev.phonePrefix || '0414') : prev.phonePrefix,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAccountError('');

        if (!formData.bank || !formData.accountNumber) return;
        if (formData.isPagoMovil === 'no' && !formData.accountType) return;

        // Validate account number against bank rules (non pago-móvil)
        if (formData.isPagoMovil === 'no' && selectedBank?.rules?.account) {
            const { firstDigits, length } = selectedBank.rules.account;

            if (length && length > 0 && formData.accountNumber.length !== length) {
                setAccountError(`El número de cuenta debe tener exactamente ${length} dígitos.`);
                return;
            }
            if (firstDigits && !formData.accountNumber.startsWith(firstDigits)) {
                setAccountError(`El número de cuenta de ${selectedBank.name} debe comenzar con ${firstDigits}.`);
                return;
            }
        }

        // Validate phone number for pago móvil (7 digits after prefix)
        if (formData.isPagoMovil === 'si' && formData.accountNumber.length !== 7) {
            setAccountError('El número telefónico debe tener 7 dígitos.');
            return;
        }

        // Combine prefix + number for pago móvil
        const finalData = { ...formData };
        if (formData.isPagoMovil === 'si') {
            finalData.accountNumber = `${formData.phonePrefix}${formData.accountNumber}`;
        }

        onNext(finalData);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Datos Bancarios
                    </Typography>
                    <Typography color="text.secondary">
                        ¿Dónde debemos depositar los Bolívares?
                    </Typography>
                </Box>

                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            <FormControl fullWidth>
                            <InputLabel>Banco del Destinatario</InputLabel>
                            <Select
                                name="bank"
                                value={formData.bank}
                                label="Banco del Destinatario"
                                onChange={handleChange}
                                disabled={loadingBanks}
                                startAdornment={loadingBanks && <CircularProgress size={20} sx={{ mr: 1 }} />}
                            >
                                {banks.map((b) => (
                                    <MenuItem key={b.slug} value={b.slug}>
                                        {b.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                            <FormControl component="fieldset">
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>¿Es Pago Móvil?</Typography>
                                <RadioGroup
                                    row
                                    name="isPagoMovil"
                                    value={formData.isPagoMovil}
                                    onChange={handlePagoMovilChange}
                                >
                                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            {formData.isPagoMovil === 'no' && (
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de cuenta</InputLabel>
                                    <Select
                                        name="accountType"
                                        value={formData.accountType}
                                        label="Tipo de cuenta"
                                        onChange={handleChange}
                                        required={formData.isPagoMovil === 'no'}
                                    >
                                        <MenuItem value="Ahorro">Ahorro</MenuItem>
                                        <MenuItem value="Corriente">Corriente</MenuItem>
                                    </Select>
                                </FormControl>
                            )}

                            {formData.isPagoMovil === 'si' ? (
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <FormControl sx={{ minWidth: 110 }}>
                                        <InputLabel>Prefijo</InputLabel>
                                        <Select
                                            value={formData.phonePrefix}
                                            label="Prefijo"
                                            onChange={(e) => {
                                                setAccountError('');
                                                setFormData(prev => ({ ...prev, phonePrefix: e.target.value }));
                                            }}
                                        >
                                            <MenuItem value="0412">0412</MenuItem>
                                            <MenuItem value="0414">0414</MenuItem>
                                            <MenuItem value="0416">0416</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Número de teléfono"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        inputMode="numeric"
                                        required
                                        placeholder="1234567"
                                        error={!!accountError}
                                        helperText={accountError || 'Ingresa los 7 dígitos del número'}
                                        inputProps={{ maxLength: 7 }}
                                    />
                                </Stack>
                            ) : (
                                <TextField
                                    label={`Número de cuenta${selectedBank?.rules?.account?.length ? ` (${selectedBank.rules.account.length} dígitos)` : ''}`}
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    inputMode="numeric"
                                    required
                                    error={!!accountError}
                                    helperText={accountError || (
                                        selectedBank?.rules?.account?.firstDigits
                                            ? `Debe comenzar con ${selectedBank.rules.account.firstDigits} y tener ${selectedBank.rules.account.length} dígitos`
                                            : (selectedBank?.rules?.account?.length
                                                ? `Ingresa los ${selectedBank.rules.account.length} dígitos de la cuenta`
                                                : 'Ingresa el número de cuenta')
                                    )}
                                    inputProps={selectedBank?.rules?.account?.length ? { maxLength: selectedBank.rules.account.length } : {}}
                                />
                            )}

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={onBack}
                                    startIcon={<ArrowLeftIcon />}
                                    sx={{ borderRadius: 3, py: 1.5 }}
                                >
                                    Atrás
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ borderRadius: 3, py: 1.5, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                                >
                                    Revisar y Confirmar
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </Container>
    );
}
