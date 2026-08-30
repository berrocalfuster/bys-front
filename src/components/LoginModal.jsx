import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

import api from '../services/api';

const TITLES = {
    login: 'Ingresar',
    signup: 'Crear cuenta',
    'reset-email': 'Recuperar clave',
    'reset-code': 'Crea tu nueva clave',
};

const SUBTITLES = {
    login: 'Ingresa con tu correo y tu clave.',
    signup: 'Completa tus datos para crear tu cuenta.',
    'reset-email': 'Te enviaremos un código a tu correo.',
    'reset-code': 'Ingresa el código y tu nueva clave.',
};

export default function LoginModal({ open, onClose }) {
    const { login: setLoggedInUser } = useAuth();

    const [step, setStep] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const resetMessages = () => { setError(''); setInfo(''); };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        resetMessages();
        setIsLoading(true);
        try {
            const data = await api.post('/auth/login', { email, password });
            if (data.needsPasswordSetup) {
                setInfo('Tu cuenta todavía no tiene una clave configurada. Te enviamos un código a tu correo para activarla.');
                await api.post('/auth/request-password-reset', { email });
                setStep('reset-code');
            } else if (data.user) {
                setLoggedInUser(data.user);
                handleClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        resetMessages();
        setIsLoading(true);
        try {
            const data = await api.post('/auth/signup', { email, password, name, phone });
            if (data.user) {
                setLoggedInUser(data.user);
                handleClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        resetMessages();
        setIsLoading(true);
        try {
            await api.post('/auth/request-password-reset', { email });
            setStep('reset-code');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        resetMessages();
        setIsLoading(true);
        try {
            const data = await api.post('/auth/reset-password', { email, code, newPassword });
            if (data.user) {
                setLoggedInUser(data.user);
                handleClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const goToStep = (nextStep) => {
        resetMessages();
        setStep(nextStep);
    };

    const handleClose = () => {
        setStep('login');
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setCode('');
        setNewPassword('');
        setError('');
        setInfo('');
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
            <DialogContent>
                <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
                    {TITLES[step]}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    {step === 'reset-code' ? `${SUBTITLES[step]} Enviado a ${email}` : SUBTITLES[step]}
                </Typography>

                {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {step === 'login' && (
                    <form onSubmit={handleLoginSubmit}>
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
                            <TextField
                                label="Clave"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
                            </Button>
                            <Stack direction="row" justifyContent="space-between">
                                <Button size="small" onClick={() => goToStep('signup')}>Crear cuenta</Button>
                                <Button size="small" onClick={() => goToStep('reset-email')}>¿Olvidaste tu clave?</Button>
                            </Stack>
                        </Stack>
                    </form>
                )}

                {step === 'signup' && (
                    <form onSubmit={handleSignupSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Nombre completo"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
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
                            <TextField
                                label="Correo electrónico"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                label="Crea tu clave"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                helperText="Mínimo 6 caracteres"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Crear cuenta'}
                            </Button>
                            <Button size="small" onClick={() => goToStep('login')}>¿Ya tienes cuenta? Inicia sesión</Button>
                        </Stack>
                    </form>
                )}

                {step === 'reset-email' && (
                    <form onSubmit={handleRequestReset}>
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
                                {isLoading ? <CircularProgress size={24} /> : 'Enviar código'}
                            </Button>
                            <Button size="small" onClick={() => goToStep('login')}>Volver a iniciar sesión</Button>
                        </Stack>
                    </form>
                )}

                {step === 'reset-code' && (
                    <form onSubmit={handleResetSubmit}>
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
                            <TextField
                                label="Nueva clave"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                helperText="Mínimo 6 caracteres"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ borderRadius: 3, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Guardar clave y entrar'}
                            </Button>
                            <Button size="small" onClick={() => goToStep('reset-email')}>Volver / Cambiar correo</Button>
                        </Stack>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
