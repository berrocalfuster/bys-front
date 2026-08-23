import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PayButton({ amount, onSuccess, onBack, isLoading }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setSubmitting(true);
        setError('');

        const { error: submitError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (submitError) {
            setError(submitError.message || 'No se pudo procesar el pago. Intenta con otra tarjeta.');
            setSubmitting(false);
            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            onSuccess({ pending: false });
        } else if (paymentIntent?.status === 'processing') {
            // ACH bank transfers aren't instant — they settle in a few business days.
            // The webhook confirms the final "paid" status once funds actually clear.
            onSuccess({ pending: true });
        } else {
            setError('El pago no pudo confirmarse. Intenta de nuevo.');
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <PaymentElement />
            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={onBack}
                    disabled={submitting || isLoading}
                    sx={{ borderRadius: 3, py: 1.5 }}
                >
                    Atrás
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handlePay}
                    disabled={!stripe || submitting || isLoading}
                    sx={{ borderRadius: 3, py: 1.5, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : `Pagar $${Number(amount || 0).toFixed(2)}`}
                </Button>
            </Box>
        </Box>
    );
}

export default function CardPaymentForm({
    amount,
    createSolicitud, // legacy prop name, kept so the remesa flow doesn't need to change
    createEntity,
    paymentEndpoint = '/payments/create-intent',
    buildPaymentBody = (id) => ({ solicitudId: id }),
    onSuccess,
    onBack,
}) {
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const create = createEntity || createSolicitud;

        const init = async () => {
            try {
                const entityId = await create();
                const data = await api.post(paymentEndpoint, buildPaymentBody(entityId));
                if (!cancelled) {
                    if (data?.clientSecret) {
                        setClientSecret(data.clientSecret);
                    } else {
                        setError(data?.errorMessage || 'No se pudo iniciar el cobro.');
                    }
                }
            } catch (err) {
                if (!cancelled) setError(err.message || 'No se pudo iniciar el cobro.');
            }
        };

        init();
        return () => { cancelled = true; };
    }, []);

    if (error) {
        return <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>;
    }

    if (!clientSecret) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">Preparando el cobro seguro...</Typography>
            </Box>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PayButton amount={amount} onSuccess={onSuccess} onBack={onBack} />
        </Elements>
    );
}
