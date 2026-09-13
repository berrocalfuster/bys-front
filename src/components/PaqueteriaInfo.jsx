import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Stack,
    Chip,
    Dialog,
    IconButton,
    Button,
    Grid,
} from '@mui/material';
import {
    HiXMark,
    HiOutlineCalculator,
    HiOutlineCube,
    HiOutlineScale,
    HiOutlineTag,
    HiOutlineTv,
    HiOutlineShieldCheck,
    HiOutlineTruck,
} from 'react-icons/hi2';
import { RATE_GROUPS, NOTES, TV_PRICING, GALLERY } from '../data/paqueteriaData';

const PACKING_TIPS = [
    { icon: <HiOutlineCube size={24} />, title: 'Cajas Heavy Duty', desc: 'Usa cajas nuevas y resistentes (tipo Lowe\'s). No uses cajas usadas o dañadas.' },
    { icon: <HiOutlineScale size={24} />, title: 'Respeta el peso máximo', desc: 'No abultes ni sobrecargues una sola caja — si pesa mucho, divide la mercancía en varias cajas.' },
    { icon: <HiOutlineTag size={24} />, title: 'Asegura bien tu paquete', desc: 'Cierra con cinta resistente y asegúrate de que quede compacta, no abultada.' },
    { icon: <HiOutlineShieldCheck size={24} />, title: 'No incluyas artículos prohibidos', desc: 'Revisa la lista de artículos restringidos antes de empacar (armas, municiones, líquidos inflamables, entre otros).' },
];

export default function PaqueteriaInfo() {
    const [lightbox, setLightbox] = useState(null);
    const navigate = useNavigate();

    return (
        <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                <Chip label="🤝 Agentes autorizados de Cargoexpress Venezuela" color="primary" sx={{ fontWeight: 700, py: 2.5 }} />
                <Chip label="Aliados con Tealca" variant="outlined" sx={{ fontWeight: 700, py: 2.5 }} />
            </Stack>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Enviamos encomiendas y mercancía desde Estados Unidos con entrega puerta a puerta en toda Venezuela.
            </Typography>

            <Button
                variant="contained"
                startIcon={<HiOutlineCalculator size={20} />}
                onClick={() => navigate('/calculadora-paqueteria')}
                sx={{ borderRadius: 3, py: 1.25, px: 3, mb: 4 }}
            >
                Calcula tu envío
            </Button>

            {RATE_GROUPS.map((group) => (
                <Box key={group.label} sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>{group.label}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                        {group.boxes.map((b) => (
                            <Box
                                key={b.size}
                                sx={{
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    p: 2.5,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    {b.size}
                                </Typography>
                                <Typography variant="h5" fontWeight={900} color="primary.main">
                                    ${b.price}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 3,
                    p: 3,
                    mb: 5,
                }}
            >
                {NOTES.map((note) => (
                    <Typography key={note} variant="body2" sx={{ fontWeight: 600 }}>{note}</Typography>
                ))}
            </Box>

            {/* Consejos de embalaje */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Consejos para embalar tu caja</Typography>
            <Grid container spacing={2} sx={{ mb: 5 }}>
                {PACKING_TIPS.map((tip) => (
                    <Grid item xs={12} sm={6} key={tip.title}>
                        <Box
                            sx={{
                                p: 2.5, height: '100%', display: 'flex', gap: 2,
                                bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 3,
                            }}
                        >
                            <Box sx={{ color: 'primary.main', flexShrink: 0 }}>{tip.icon}</Box>
                            <Box>
                                <Typography fontWeight={800} sx={{ mb: 0.5 }}>{tip.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{tip.desc}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Envío de televisores */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Envío de televisores</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compra tu TV en Estados Unidos y te la llevamos a cualquier parte de Venezuela por vía marítima.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
                {TV_PRICING.map((tv) => (
                    <Box
                        key={tv.size}
                        sx={{
                            bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
                            borderRadius: 3, p: 2.5, textAlign: 'center',
                        }}
                    >
                        <HiOutlineTv size={22} style={{ opacity: 0.5, marginBottom: 6 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{tv.size}</Typography>
                        <Typography variant="h6" fontWeight={900} color="primary.main">${tv.price}</Typography>
                    </Box>
                ))}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 5, color: 'text.secondary' }}>
                *El televisor viaja en su caja original o en cualquier otra caja adecuada. Los televisores de más de 55" requieren un crate de madera.
            </Typography>

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Nuestra red y servicio</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                    gap: 1.5,
                    mb: 5,
                }}
            >
                {GALLERY.map((img) => (
                    <Box
                        key={img.file}
                        component="button"
                        onClick={() => setLightbox(img)}
                        sx={{
                            gridColumn: img.wide ? { sm: '1 / -1' } : undefined,
                            p: 0,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            lineHeight: 0,
                            '&:hover img': { transform: 'scale(1.03)' },
                        }}
                    >
                        <Box
                            component="img"
                            src={`/assets/images/paqueteria/${img.file}`}
                            alt={img.alt}
                            sx={{ width: '100%', height: img.wide ? 220 : 180, objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                        />
                    </Box>
                ))}
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<HiOutlineTruck size={20} />}
                    onClick={() => navigate('/p/envio-ups')}
                    sx={{ borderRadius: 3, py: 1.25 }}
                >
                    Envía tu propio paquete por UPS (SendBox)
                </Button>
                <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/p/terminos')}
                    sx={{ borderRadius: 3, py: 1.25 }}
                >
                    Ver términos y condiciones completos →
                </Button>
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
                *Tarifas referenciales, sujetas a confirmación al momento del envío. La carga debe estar en oficina una semana antes de la fecha de salida pautada.
                Escríbenos por WhatsApp (USA) al +1 (832) 815-9187 para cotizar tu envío.
            </Typography>

            <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="md" fullWidth>
                <IconButton
                    onClick={() => setLightbox(null)}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', zIndex: 1 }}
                >
                    <HiXMark />
                </IconButton>
                {lightbox && (
                    <Box component="img" src={`/assets/images/paqueteria/${lightbox.file}`} alt={lightbox.alt} sx={{ width: '100%', display: 'block' }} />
                )}
            </Dialog>
        </Box>
    );
}
