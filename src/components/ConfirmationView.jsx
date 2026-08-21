import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Stack,
    Typography,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import api from '../services/api';
import { HiExclamationCircle } from 'react-icons/hi2';
import CardPaymentForm from './CardPaymentForm';

// Inline SVG ArrowLeft
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function ConfirmationView({ onUpload, isLoading, onBack, onCreateCardSolicitud, onCardSuccess }) {
    const { calculation } = useSelector(state => state.transaction);
    const sourceCurrency = calculation.from;

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

    useEffect(() => {
        api.get('/bank-accounts')
            .then(res => {
                if (Array.isArray(res)) setAccounts(res);
            })
            .catch(err => console.error('Error loading bank accounts:', err))
            .finally(() => setIsLoadingAccounts(false));
    }, []);

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc => acc.currency === sourceCurrency);
    }, [accounts, sourceCurrency]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileError(false);
        }
    };

    const handleConfirm = () => {
        if (!file) {
            setFileError(true);
            return;
        }
        onUpload(file);
    };

    const BankAccountInfo = ({ bankName, accountType, number, routingNumber, zellePhone, rut, email, holderName }) => (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                {/* Placeholder for bank logo */}
                <Box sx={{ width: 24, height: 24, bgcolor: '#eee', borderRadius: '50%' }} />
                <Typography fontWeight={700}>{bankName}</Typography>
            </Stack>
            <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary">{holderName}</Typography>
                {rut && <Typography variant="body2">RUT/EIN: <strong>{rut}</strong></Typography>}
                <Typography variant="body2">{accountType}: <strong>{number}</strong></Typography>
                {routingNumber && <Typography variant="body2">Número de ruta (Routing): <strong>{routingNumber}</strong></Typography>}
                {zellePhone && <Typography variant="body2">Zelle: <strong>{zellePhone}</strong></Typography>}
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{email}</Typography>
            </Box>
        </Box>
    );

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Pago y Confirmación
                    </Typography>
                    <Typography color="text.secondary">
                        Elige cómo quieres pagar tu envío.
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    value={paymentMethod}
                    exclusive
                    onChange={(e, value) => value && setPaymentMethod(value)}
                    fullWidth
                    sx={{ '& .MuiToggleButton-root': { py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none' } }}
                >
                    <ToggleButton value="card">💳 Tarjeta o banco (al instante)</ToggleButton>
                    <ToggleButton value="manual">🏦 Transferencia manual</ToggleButton>
                </ToggleButtonGroup>

                {paymentMethod === 'card' && (
                    <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom>Pagar con tarjeta o cuenta bancaria (ACH)</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tu pago se confirma automáticamente. Con cuenta bancaria (ACH) la comisión es menor, pero puede tardar unos días hábiles en acreditarse.
                        </Typography>
                        <CardPaymentForm
                            amount={calculation.amount}
                            createSolicitud={onCreateCardSolicitud}
                            onSuccess={onCardSuccess}
                            onBack={onBack}
                        />
                    </Card>
                )}

                {paymentMethod === 'manual' && (
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Nuestras Cuentas Bancarias</Typography>

                    {isLoadingAccounts ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : filteredAccounts.length > 0 ? (
                        filteredAccounts.map((acc, idx) => (
                            <Box key={acc._id}>
                                <BankAccountInfo
                                    bankName={acc.bank?.name || 'Banco'}
                                    holderName={acc.accountHolderName}
                                    accountType={acc.accountType}
                                    number={acc.accountNumber}
                                    routingNumber={acc.routingNumber}
                                    zellePhone={acc.zellePhone}
                                    rut={acc.accountHolderId}
                                    email={acc.email}
                                />
                                {idx < filteredAccounts.length - 1 && <Divider sx={{ my: 3 }} />}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ 
                            py: 6, 
                            px: 2, 
                            textAlign: 'center', 
                            bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                            borderRadius: 4,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}>
                            <Box sx={{ color: 'text.disabled', mb: 2 }}>
                                <HiExclamationCircle size={48} />
                            </Box>
                            <Typography variant="h6" fontWeight={800} gutterBottom>
                                No hay cuentas disponibles
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No tenemos cuentas registradas para recibir pagos en <strong>{sourceCurrency}</strong> en este momento. Por favor, contacta a soporte para más información.
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 4 }}>
                        <Typography fontWeight={600} gutterBottom>Sube tu comprobante</Typography>
                        <Typography variant="caption" color="text.secondary" paragraph>
                            Adjunta una imagen o captura de la transferencia realizada.
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            color={fileError ? 'error' : 'primary'}
                            sx={{ 
                                py: 2, 
                                borderStyle: 'dashed', 
                                borderWidth: 2,
                                borderColor: fileError ? 'error.main' : 'divider',
                                '&:hover': {
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                }
                            }}
                        >
                            {file ? file.name : 'Seleccionar Archivo (Requerido)'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {fileError && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', textAlign: 'center', fontWeight: 600 }}>
                                Debes adjuntar el comprobante para continuar
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Stack spacing={2} direction="row">
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={onBack}
                                startIcon={<ArrowLeftIcon />}
                                sx={{ borderRadius: 3, py: 1.5 }}
                                disabled={isLoading}
                            >
                                Atrás
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                color="primary"
                                onClick={handleConfirm}
                                disabled={isLoading || (!isLoadingAccounts && filteredAccounts.length === 0)}
                                sx={{ borderRadius: 3, py: 1.5, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Solicitud'}
                            </Button>
                        </Stack>
                    </Box>

                </Card>
                )}
            </Stack>
        </Container>
    );
}
