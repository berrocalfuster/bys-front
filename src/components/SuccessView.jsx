import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { HiCheckCircle } from 'react-icons/hi2';

const MESSAGES = {
    manual: {
        title: '¡Enviado Exitosamente!',
        body: 'Hemos recibido tu solicitud y comprobante. Procesaremos tu cambio a la brevedad.',
    },
    paid: {
        title: '¡Pagado y Confirmado!',
        body: 'Tu pago se confirmó al instante. Ya estamos procesando tu envío.',
    },
    pending_bank: {
        title: '¡Pago en camino!',
        body: 'Tu transferencia bancaria fue aceptada y está siendo procesada. Te avisaremos por correo en cuanto se confirme (puede tardar unos días hábiles).',
    },
};

export default function SuccessView({ onReset, variant = 'manual' }) {
    const { title, body } = MESSAGES[variant] || MESSAGES.manual;
    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Stack spacing={4} alignItems="center" textAlign="center">
                <Box sx={{ color: 'primary.main' }}>
                    <HiCheckCircle size={80} />
                </Box>

                <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        {title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1.2rem', maxWidth: 400, mx: 'auto' }}>
                        {body}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    size="large"
                    onClick={onReset}
                    sx={{ borderRadius: 99, px: 5 }}
                >
                    Volver al Inicio
                </Button>
            </Stack>
        </Container>
    );
}
