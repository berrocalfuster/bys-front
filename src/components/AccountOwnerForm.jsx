import { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    Autocomplete
} from '@mui/material';

// Inline SVG ArrowLeft
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function AccountOwnerForm({ onNext, onBack, savedRecipients = [], initialData = {} }) {
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        docType: initialData.docType || 'V',
        docNumber: initialData.docNumber || '',
        nickname: initialData.nickname || '',
        saveRecipient: initialData.saveRecipient || false,
    });

    const [autocompleteValue, setAutocompleteValue] = useState(
        initialData.firstName ? { firstName: initialData.firstName, lastName: initialData.lastName } : null
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'docNumber') {
            const numericValue = value.replace(/\D/g, '');
            setFormData((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRecipientSelect = (event, newValue) => {
        setAutocompleteValue(newValue);
        if (newValue) {
            setFormData(prev => ({
                ...prev,
                firstName: newValue.firstName || '',
                lastName: newValue.lastName || '',
                docType: newValue.docType || 'V',
                docNumber: newValue.docNumber || '',
                nickname: newValue.nickname || '',
            }));
        }
    };

    const handleInputChange = (event, newInputValue) => {
        if (event && event.type === 'change') {
            setFormData(prev => ({ ...prev, firstName: newInputValue }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.docNumber || !formData.nickname) {
            return;
        }
        onNext(formData);
    };

    const recipientOptions = useMemo(() => {
        return savedRecipients.map(r => ({
            ...r,
            label: `${r.firstName} ${r.lastName} (${r.nickname || 'Sin apodo'})`
        }));
    }, [savedRecipients]);

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        ¿Quién recibe el dinero?
                    </Typography>
                    <Typography color="text.secondary">
                        Proporciona los datos del titular de la cuenta bancaria en Venezuela.
                    </Typography>
                </Box>

                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            <Autocomplete
                                freeSolo
                                options={recipientOptions}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') return option;
                                    return option.firstName || '';
                                }}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id || Math.random()}>
                                        <Stack>
                                            <Typography variant="body1">{option.firstName} {option.lastName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{option.nickname}</Typography>
                                        </Stack>
                                    </li>
                                )}
                                value={autocompleteValue}
                                onChange={handleRecipientSelect}
                                onInputChange={handleInputChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombres"
                                        required
                                    />
                                )}
                            />

                            <TextField
                                label="Apellidos"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />

                            <Stack direction="row" spacing={2}>
                                <Box sx={{ width: '110px' }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                            name="docType"
                                            value={formData.docType}
                                            label="Tipo"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="V">V</MenuItem>
                                            <MenuItem value="E">E</MenuItem>
                                            <MenuItem value="J">J</MenuItem>
                                            <MenuItem value="P">P</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <TextField
                                    label="Cédula de Identidad"
                                    name="docNumber"
                                    value={formData.docNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    inputMode="numeric"
                                    placeholder="12345678"
                                    required
                                    sx={{ flex: 1 }}
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <TextField
                                    label="Apodo para esta cuenta"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Ej. Mi cuenta personal, Mamá, etc."
                                    helperText="Para que la identifiques fácilmente en el futuro"
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.saveRecipient}
                                            onChange={(e) => setFormData(prev => ({ ...prev, saveRecipient: e.target.checked }))}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                            Guardar<br />destinatario
                                        </Typography>
                                    }
                                    sx={{ mt: 1, minWidth: 'max-content' }}
                                />
                            </Stack>

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
                                    Guardar y Continuar
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </Container>
    );
}
