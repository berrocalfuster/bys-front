import { Box, Button, Container, Grid, Typography, Stack } from '@mui/material';
import { HiArrowSmallRight } from 'react-icons/hi2';

export default function DownloadBanner() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)',
        py: { xs: 8, md: 12 },
        borderTop: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ animation: 'fadeInLeft 0.8s ease-out' }}>
              <Typography
                variant="h2"
                fontWeight={900}
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                Lleva Remesas BYS <br />
                <Box component="span" sx={{ color: 'primary.main' }}>en tu bolsillo</Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, fontWeight: 400, maxWidth: 480, lineHeight: 1.6 }}
              >
                Muy pronto podrás descargar nuestra aplicación y realiza tus envíos aún más rápido.
                Seguridad biométrica, notificaciones en tiempo real y las mejores tasas, todo en un solo lugar.
              </Typography>

              {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box
                  component="button"
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    p: '10px 24px',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 30 }} />
                </Box>
                <Box
                  component="button"
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    p: '10px 24px',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 30 }} />
                </Box>
              </Stack> */}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeInRight 0.8s ease-out'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 300,
                  height: 300,
                  bgcolor: 'primary.main',
                  opacity: 0.1,
                  borderRadius: '50%',
                  filter: 'blur(60px)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              />
              <Box
                component="img"
                src="/assets/images/remesas_woman_phone.png"
                sx={{
                  width: '100%',
                  maxWidth: 450,
                  position: 'relative',
                  zIndex: 1,
                  filter: (theme) => theme.palette.mode === 'dark' ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' : 'drop-shadow(0 20px 40px rgba(221,62,0,0.1))',
                  animation: 'float 6s ease-in-out infinite'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
