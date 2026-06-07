import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    InputAdornment,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

import api from '../services/api';

export default function LoginModal({ open, onClose }) {
    const { login } = useAuth();

    // Steps: 'email' -> 'code' -> 'profile' (if needed)
    const [step, setStep] = useState('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/auth/init', { email });
            setStep('code');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const data = await api.post('/auth/verify', { email, code });

            if (data.status === 'complete' && data.user) {
                login(data.user);
                handleClose();
            } else if (data.status === 'pending_profile') {
                setStep('profile');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        if (!name.trim() || !phone.trim()) {
            setError('Todos los campos son obligatorios');
            setIsLoading(false);
            return;
        }
        try {
            const data = await api.post('/auth/complete', { email, name, phone });

            if (data.user) {
                login(data.user);
                handleClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('email');
        setEmail('');
        setCode('');
        setName('');
        setPhone('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
            <DialogContent>
                <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
                    Ingresar
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    {step === 'email' && 'Ingresa tu correo para recibir un código de acceso.'}
                    {step === 'code' && `Ingresa el código enviado a ${email}`}
                    {step === 'profile' && 'Completa tu perfil para continuar.'}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Correo electrónico"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Continuar'}
                            </Button>
                        </Stack>
                    </form>
                )}

                {step === 'code' && (
                    <form onSubmit={handleCodeSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Código de 6 dígitos"
                                variant="outlined"
                                fullWidth
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                autoFocus
                                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: 4, fontSize: '1.2rem' } }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Verificar'}
                            </Button>
                            <Button size="small" onClick={() => setStep('email')}>Volver / Cambiar correo</Button>
                        </Stack>
                    </form>
                )}

                {step === 'profile' && (
                    <form onSubmit={handleProfileSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Nombre completo"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Teléfono"
                                type="tel"
                                variant="outlined"
                                fullWidth
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="9 1234 5678"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Registrar y Continuar'}
                            </Button>
                        </Stack>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
