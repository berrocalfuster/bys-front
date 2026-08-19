import { Box, Container, Grid, Link, Stack, Typography, IconButton, Divider } from '@mui/material';

// Manual SVG icons for social media
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path>
  </svg>
);

import { MdAccountBalanceWallet } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';

export default function Footer({ onPageClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: '#1f120d', color: 'white', pt: 8, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  component="img"
                  src="/assets/images/logo-bys-oficial.jpg"
                  alt="B&S Global Services LLC"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    background: 'linear-gradient(45deg, #dd3e00 30%, #ffb38a 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                  }}
                >
                  B&S Global Services
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 280, lineHeight: 1.8 }}>
                La forma más rápida y segura de enviar dinero a Venezuela. Únete a cientos de personas que ahorran en cada transferencia.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 280, lineHeight: 1.8, fontWeight: 700 }}>
                🤝 Agentes autorizados de Cargoexpress Venezuela, aliados con Tealca para la distribución puerta a puerta.
              </Typography>
              <Stack direction="row" spacing={1}>
                {/* Guardados para uso futuro: TwitterIcon, LinkedInIcon */}
                <IconButton
                  component="a"
                  href="https://www.instagram.com/remesasbys1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <FaInstagram size={24} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.facebook.com/Remesasbys1"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <FacebookIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Nosotros</Typography>
            <Stack spacing={1}>
              {[
                { label: 'Sobre B&S Global Services', slug: 'nosotros' },
                { label: 'Paquetería', slug: 'paqueteria' },
                { label: 'Carreras', slug: 'carreras' },
                { label: 'Contacto', slug: 'contacto' }
              ].map(item => (
                <Link
                  key={item.slug}
                  component="button"
                  onClick={() => onPageClick(item.slug)}
                  color="inherit"
                  underline="none"
                  sx={{ textAlign: 'left', opacity: 0.6, fontSize: '0.9rem', '&:hover': { opacity: 1 } }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Legal</Typography>
            <Stack spacing={1}>
              {[
                { label: 'Términos', slug: 'terminos' },
                { label: 'Privacidad', slug: 'privacidad' },
                { label: 'Cookies', slug: 'cookies' },
                { label: 'Seguridad', slug: 'seguridad' }
              ].map(item => (
                <Link
                  key={item.slug}
                  component="button"
                  onClick={() => onPageClick(item.slug)}
                  color="inherit"
                  underline="none"
                  sx={{ textAlign: 'left', opacity: 0.6, fontSize: '0.9rem', '&:hover': { opacity: 1 } }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Contacto y Soporte</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>Email</Typography>
                <Typography variant="body1">contacto@bnsglobalservices.com</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>WhatsApp (USA)</Typography>
                <Typography variant="body1">+1 (832) 815-9187</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>WhatsApp (Chile)</Typography>
                <Typography variant="body1">+56 9 3571 6037</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>Horario</Typography>
                <Typography variant="body1">Lun - Vie: 9:00 - 18:00</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="caption" sx={{ opacity: 0.4 }}>
            © {currentYear} B&S Global Services. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.4 }}>
            Hecho con ❤️ para la comunidad hispana.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
