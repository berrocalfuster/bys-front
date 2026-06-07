import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Stack, Avatar, Card, IconButton, Divider } from '@mui/material';
import { MdSwapHoriz, MdEdit } from 'react-icons/md';
import { HiLightningBolt } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountOwnerForm from './AccountOwnerForm';
import BankDetailsForm from './BankDetailsForm';
import SummaryView from './SummaryView';
import ConfirmationView from './ConfirmationView';
import SuccessView from './SuccessView';
import api from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { resetTransaction } from '../store/slices/transactionSlice';

const STEPS = {
    OWNER_FORM: 'owner_form',
    BANK_FORM: 'bank_form',
    SUMMARY: 'summary',
    CONFIRMATION: 'confirmation',
    SUCCESS: 'success',
    PROFILE: 'profile',
};

export default function Dashboard({ onBack, initialStep = STEPS.OWNER_FORM, pendingTransfer = null }) {
    const reduxTransaction = useSelector(state => state.transaction);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // Check if we should start at Summary (if coming from AI with enough data)
    const isAiComplete = reduxTransaction.calculation.amount && 
                         reduxTransaction.recipient.firstName && 
                         reduxTransaction.bank.bank;

    const [step, setStep] = useState(isAiComplete ? STEPS.SUMMARY : initialStep);
    const [isLoading, setIsLoading] = useState(false);
    const [savedRecipients, setSavedRecipients] = useState([]);

    // Data Collection - Priority: pendingTransfer (Calculator) > reduxTransaction (AI) > Empty
    const [transferData, setTransferData] = useState(() => {
        return {
            owner: reduxTransaction?.recipient || {},
            bank: reduxTransaction?.bank || {},
            calculation: pendingTransfer || reduxTransaction?.calculation || {},
        };
    });


    useEffect(() => {
        if (user?.email) {
            api.get(`/recipients?email=${user.email}`)
                .then(data => {
                    if (Array.isArray(data)) {
                        setSavedRecipients(data);
                    }
                })
                .catch(err => console.error('Error fetching recipients:', err));
        }
    }, [user?.email]);

    // Safety check: If no calculation data is present, redirect home
    useEffect(() => {
        if (!reduxTransaction.calculation.amount && !pendingTransfer) {
            navigate('/');
        }
    }, [reduxTransaction.calculation.amount, pendingTransfer, navigate]);

    // Update calculation if pendingTransfer changes
    useEffect(() => {
        if (pendingTransfer) {
            setTransferData(prev => ({ ...prev, calculation: pendingTransfer }));
        }
    }, [pendingTransfer]);

    // Step Handlers
    const handleOwnerFormNext = (data) => {
        setTransferData(prev => ({ ...prev, owner: data }));
        setStep(STEPS.BANK_FORM);
    };

    const handleBankFormNext = (data) => {
        setTransferData(prev => ({ ...prev, bank: data }));
        setStep(STEPS.SUMMARY);
    };

    const handleEditStep = (targetStep) => {
        setStep(targetStep);
    };

    const handleConfirmSummary = () => {
        setStep(STEPS.CONFIRMATION);
    };

    const handleFinalUpload = async (file) => {
        setIsLoading(true);

        try {
            let finalImageUrl = null;

            if (file) {
                // 1. Get Presigned URL with retry (up to 3 attempts)
                let presignData = null;
                const maxAttempts = 3;

                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    try {
                        const resData = await api.post('/api/1.0/medios/presigne-url-public', { 
                            name: file.name,
                            type: file.type
                        });
                        
                        // Valid URL has to contain "wesyncro" and not be the generic fallback endpoint
                        const isValid = resData?.put && 
                                        resData.put.includes('wesyncro') && 
                                        resData.put !== 'https://s3.us-west-2.amazonaws.com/';

                        if (isValid && resData.link) {
                            presignData = resData;
                            break; // Success, break loop
                        }
                        
                        console.warn(`Intento ${attempt}: URL de presigned inválida o genérica recibida:`, resData?.put);
                    } catch (err) {
                        console.error(`Error en intento ${attempt} de obtener presigned URL:`, err);
                    }

                    if (attempt < maxAttempts) {
                        // Wait 500ms before retrying
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }

                if (!presignData?.put || !presignData?.link) {
                    throw new Error('Error al obtener una URL de carga válida tras 3 intentos');
                }

                // 2. Upload File to S3/Storage via PUT (raw fetch because it's a signed URL from AWS)
                const uploadResponse = await api.raw(presignData.put, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                        'x-amz-acl': 'public-read'
                    }
                });

                if (!uploadResponse.ok) {
                    throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
                }

                finalImageUrl = presignData.link;
            }

            // 3. Save Transaction in backend
            const payload = {
                propietario: import.meta.env.VITE_PROPIETARIO,
                owner: transferData.owner,
                bank: transferData.bank,
                ...transferData.calculation,
                imageUrl: finalImageUrl,
                transferImageUrl: finalImageUrl, // Match the "correct" example too
                user: {
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                },
                saveRecipient: transferData.owner.saveRecipient,
                date: new Date()
            };

            const saveRes = await api.post('/solicitud', payload);

            setTimeout(() => {
                setIsLoading(false);
                setStep(STEPS.SUCCESS);
            }, 1000);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Error al procesar la solicitud. Intente nuevamente.');
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        dispatch(resetTransaction());
        setTransferData({ owner: {}, bank: {}, calculation: {} });
        setStep(STEPS.OWNER_FORM);
        onBack(); // Go back to calculator or stay in dashboard home
    };

    const formatMoney = (amount, currency) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const TransactionFeedbackHeader = () => {
        const { calculation } = transferData;
        if (!calculation.from) return null;

        return (
            <Box 
                sx={{ 
                    bgcolor: 'background.paper', 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    py: 2,
                    position: 'sticky',
                    top: { xs: 64, md: 80 },
                    zIndex: 10,
                    backdropFilter: 'blur(20px)',
                    animation: 'fadeInDown 0.5s ease-out'
                }}
            >
                <Container maxWidth="md">
                    <Card 
                        onClick={onBack}
                        sx={{ 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            gap: 2,
                            cursor: 'pointer',
                            bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(221, 62, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid',
                            borderColor: 'primary.main',
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                                bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(221, 62, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                                transform: 'scale(1.01)'
                            }
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, display: 'flex' }}>
                                <HiLightningBolt size={20} />
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Estás enviando
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="h5" fontWeight={900}>{formatMoney(calculation.amount, calculation.from)}</Typography>
                                    <MdSwapHoriz size={20} style={{ opacity: 0.5 }} />
                                    <Typography variant="h5" fontWeight={900} color="primary.main">{formatMoney(calculation.total, calculation.to)}</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                        
                        <Button 
                            variant="text" 
                            startIcon={<MdEdit />}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                        >
                            Cambiar monto
                        </Button>
                    </Card>
                </Container>
            </Box>
        );
    };

    // Render Logic
    const renderContent = () => {
        switch (step) {
            case STEPS.OWNER_FORM:
                return (
                    <Box sx={{ py: 4 }}>
                        <AccountOwnerForm
                            onNext={handleOwnerFormNext}
                            onBack={onBack}
                            savedRecipients={savedRecipients}
                            initialData={transferData.owner}
                        />
                    </Box>
                );

            case STEPS.BANK_FORM:
                return (
                    <Box sx={{ py: 4 }}>
                        <BankDetailsForm 
                            onNext={handleBankFormNext} 
                            onBack={() => setStep(STEPS.OWNER_FORM)} 
                            initialData={transferData.bank}
                        />
                    </Box>
                );

            case STEPS.SUMMARY:
                return (
                    <Box sx={{ py: 4 }}>
                        <SummaryView
                            data={transferData}
                            onEdit={handleEditStep}
                            onConfirm={handleConfirmSummary}
                            onBack={() => setStep(STEPS.BANK_FORM)}
                        />
                    </Box>
                );

            case STEPS.CONFIRMATION:
                return (
                    <Box sx={{ py: 4 }}>
                        <ConfirmationView
                            onUpload={handleFinalUpload}
                            isLoading={isLoading}
                            onBack={() => setStep(STEPS.SUMMARY)}
                        />
                    </Box>
                );

            case STEPS.SUCCESS:
                return <SuccessView onReset={handleReset} />;

            case STEPS.PROFILE:
                return (
                    <Container maxWidth="md" sx={{ py: 6 }}>
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
                                    onClick={() => setStep(STEPS.OWNER_FORM)}
                                    fullWidth
                                    sx={{ py: 1.5, borderRadius: 3, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                                >
                                    Nueva Transferencia
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => { logout(); onBack(); }}
                                    fullWidth
                                    sx={{ py: 1.5, borderRadius: 3 }}
                                >
                                    Cerrar Sesión
                                </Button>
                            </Stack>
                            <Button variant="text" onClick={onBack}>Volver a la calculadora</Button>
                        </Stack>
                    </Container>
                );

            default:
                return <AccountOwnerForm onNext={handleOwnerFormNext} onBack={onBack} savedRecipients={savedRecipients} />;
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '90vh' }}>
            {step !== STEPS.SUCCESS && step !== STEPS.PROFILE && <TransactionFeedbackHeader />}
            {renderContent()}
        </Box>
    );
}
