import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const CREDIT_SURCHARGE_RATE = 0.02;

function PayButton({ amount, clientSecret, paymentIntentId, onSuccess, onBack, isLoading }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    // Set once we've tokenized the payment method and detected it's a credit card —
    // holds off the actual charge until the customer sees and accepts the surcharge.
    const [pendingCredit, setPendingCredit] = useState(null); // { paymentMethodId }

    const confirmCharge = async (paymentMethodId) => {
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            clientSecret,
            confirmParams: { payment_method: paymentMethodId },
            redirect: 'if_required',
        });

        if (confirmError) {
            setError(confirmError.message || 'No se pudo procesar el pago. Intenta con otra tarjeta.');
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

    const handleConfirmSurcharge = async () => {
        if (!pendingCredit) return;
        setSubmitting(true);
        setError('');
        try {
            await api.post('/payments/apply-surcharge', {
                paymentIntentId,
                paymentMethodId: pendingCredit.paymentMethodId,
            });
            await confirmCharge(pendingCredit.paymentMethodId);
        } catch (err) {
            setError(err.message || 'No se pudo aplicar el recargo.');
            setSubmitting(false);
        }
    };

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setSubmitting(true);
        setError('');

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || 'Revisa los datos ingresados.');
            setSubmitting(false);
            return;
        }

        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ elements });
        if (pmError) {
            setError(pmError.message || 'No se pudo validar el método de pago.');
            setSubmitting(false);
            return;
        }

        const isCredit = paymentMethod.type === 'card' && paymentMethod.card?.funding === 'credit';
        if (isCredit) {
            // Show the surcharge before charging anything — the customer confirms it explicitly.
            setPendingCredit({ paymentMethodId: paymentMethod.id });
            setSubmitting(false);
            return;
        }

        await confirmCharge(paymentMethod.id);
    };

    if (pendingCredit) {
        const surcharge = Number(amount || 0) * CREDIT_SURCHARGE_RATE;
        const newTotal = Number(amount || 0) + surcharge;
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Pagando con tarjeta de crédito se aplica un cargo adicional del 2% ({`+$${surcharge.toFixed(2)}`}).
                    Nuevo total: <strong>${newTotal.toFixed(2)}</strong>.
                </Alert>
                {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        onClick={() => { setPendingCredit(null); setError(''); }}
                        disabled={submitting}
                        sx={{ borderRadius: 3, py: 1.5 }}
                    >
                        Elegir otro método
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleConfirmSurcharge}
                        disabled={submitting}
                        sx={{ borderRadius: 3, py: 1.5, boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)' }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : `Confirmar y pagar $${newTotal.toFixed(2)}`}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            <PaymentElement />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Pagos con tarjeta de crédito tienen un cargo adicional del 2%. Débito y transferencia bancaria (ACH) no tienen cargo extra.
            </Typography>
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

    const paymentIntentId = clientSecret.split('_secret_')[0];

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PayButton amount={amount} clientSecret={clientSecret} paymentIntentId={paymentIntentId} onSuccess={onSuccess} onBack={onBack} />
        </Elements>
    );
}
