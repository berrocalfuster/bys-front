import { Box, Button, Container, Grid, Stack, Typography, Skeleton, Menu, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { HiArrowSmallRight, HiChevronDown, HiSparkles } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openChat } from '../store/slices/uiSlice';
import api from '../services/api';

export default function MarketingBanner({ onAction }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = (idx) => {
    if (typeof idx === 'number') setSelectedIdx(idx);
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await api.get('/rates');
        setRates(Array.isArray(data) ? data : (data.rates || []));
      } catch (err) {
        console.error('Failed to fetch rates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);
  return (
    <Box
      sx={{
        bgcolor: '#dd3e00',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background patterns */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: '20%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, opacity: 0.9 }}>
                TU CUENTA GLOBAL PARA
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontSize: { xs: '2rem', md: '5rem' },
                  lineHeight: 0.9,
                  fontWeight: 900,
                  textTransform: 'uppercase'
                }}
              >
                ENVÍOS SIN <br />
                FRONTERAS
              </Typography>

              {/* Glass Rate Selector/Dropdown */}
              <Box sx={{ pt: 1 }}>
                {loading ? (
                  <Skeleton variant="rectangular" width={220} height={48} sx={{ borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                ) : rates.length > 0 && (
                  <>
                    <Button
                      onClick={handleClick}
                      sx={{
                        p: '10px 24px',
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 1.5,
                        color: 'white',
                        textTransform: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-2px)',
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography variant="body1" fontWeight={900} sx={{ letterSpacing: 1 }}>
                          {rates[selectedIdx].from}
                        </Typography>
                        <HiArrowSmallRight size={18} style={{ opacity: 0.6 }} />
                        <Typography variant="body1" fontWeight={900} sx={{ letterSpacing: 1 }}>
                          {rates[selectedIdx].to}
                        </Typography>
                      </Stack>
                      <HiChevronDown style={{ marginLeft: 8, opacity: 0.5 }} />
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={() => handleClose()}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          bgcolor: 'rgba(11, 17, 32, 0.95)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 1.5,
                          color: 'white',
                          minWidth: 180,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                          '& .MuiMenuItem-root': {
                            py: 1.5,
                            px: 3,
                            gap: 2,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                          }
                        }
                      }}
                    >
                      {rates.map((rate, idx) => (
                        <MenuItem key={idx} onClick={() => handleClose(idx)} selected={idx === selectedIdx}>
                          <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: 1 }}>{rate.from}</Typography>
                          <HiArrowSmallRight size={14} style={{ opacity: 0.4 }} />
                          <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: 1 }}>{rate.to}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  opacity: 0.8,
                  maxWidth: 500,
                  fontSize: '1.25rem'
                }}
              >
                Mueve tu dinero por el mundo sin comisiones ocultas y con la tasa más competitiva.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onAction}
                  sx={{
                    bgcolor: 'white',
                    color: '#dd3e00',
                    px: 4,
                    py: 2,
                    borderRadius: 99,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Crea tu cuenta
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => dispatch(openChat())}
                  startIcon={<HiSparkles />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    px: 4,
                    py: 2,
                    borderRadius: 99,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Enviar rápido
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                perspective: '1000px'
              }}
            >
              <Box
                component="img"
                src="/assets/images/remesas_family_phone-original.png"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))',
                  animation: 'float 6s ease-in-out infinite',
                  transform: 'rotateY(-5deg) rotateX(5deg)'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
