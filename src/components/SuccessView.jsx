import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { HiCheckCircle } from 'react-icons/hi2';

export default function SuccessView({ onReset }) {
    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Stack spacing={4} alignItems="center" textAlign="center">
                <Box sx={{ color: 'primary.main' }}>
                    <HiCheckCircle size={80} />
                </Box>

                <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        ¡Enviado Exitosamente!
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1.2rem', maxWidth: 400, mx: 'auto' }}>
                        Hemos recibido tu solicitud y comprobante. Procesaremos tu cambio a la brevedad.
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
