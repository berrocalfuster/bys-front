import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

// Inline SVG ArrowLeft
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function SummaryView({ data, onEdit, onConfirm, onBack }) {
    const { owner, bank } = data;

    const DetailRow = ({ label, value }) => (
        <Grid container py={1}>
            <Grid item xs={6}>
                <Typography color="text.secondary" variant="body2">{label}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography fontWeight={600} align="right" variant="body2">{value}</Typography>
            </Grid>
        </Grid>
    );

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Resumen
                    </Typography>
                    <Typography color="text.secondary">
                        Verifica que todos los datos sean correctos antes de enviar.
                    </Typography>
                </Box>

                <Card sx={{ p: 0, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

                    {/* Section 1: Titular */}
                    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>Titular</Typography>
                            <Button size="small" onClick={() => onEdit('owner_form')}>Editar</Button>
                        </Stack>
                        <DetailRow label="Nombres" value={owner?.firstName} />
                        <DetailRow label="Apellidos" value={owner?.lastName} />
                        <DetailRow label="Documento" value={`${owner?.docType}-${owner?.docNumber}`} />
                        <DetailRow label="Apodo" value={owner?.nickname} />
                    </Box>

                    <Divider />

                    {/* Section 2: Banco */}
                    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>Datos Bancarios</Typography>
                            <Button size="small" onClick={() => onEdit('bank_form')}>Editar</Button>
                        </Stack>
                        <DetailRow label="Banco" value={bank?.bank} />
                        <DetailRow label="Método" value={bank?.isPagoMovil === 'si' ? 'Pago Móvil' : 'Transferencia'} />
                        {bank?.isPagoMovil === 'no' && (
                            <DetailRow label="Tipo de cuenta" value={bank?.accountType} />
                        )}
                        <DetailRow
                            label={bank?.isPagoMovil === 'si' ? 'Teléfono' : 'Nro. Cuenta'}
                            value={bank?.accountNumber}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ p: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            color="success"
                            onClick={onConfirm}
                            sx={{ borderRadius: 3, py: 1.5, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                        >
                            Confirmar Datos
                        </Button>
                        <Button
                            variant="text"
                            fullWidth
                            onClick={onBack}
                            startIcon={<ArrowLeftIcon />}
                            sx={{ mt: 1 }}
                        >
                            Volver
                        </Button>
                    </Box>

                </Card>
            </Stack>
        </Container>
    );
}
