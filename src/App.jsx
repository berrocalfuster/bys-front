import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MarketingBanner from './components/MarketingBanner';
import DownloadBanner from './components/DownloadBanner';
import AIChatWidget from './components/AIChatWidget';
import StaticPage from './components/StaticPage';
import LoginModal from './components/LoginModal';
import Profile from './components/Profile';
import MyTransactions from './components/MyTransactions';
import KycVerification from './components/KycVerification';
import { Box, Typography, Container, Stack, Grid, Card, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import { getTheme } from './theme';
import { HiLightningBolt, HiLockClosed, HiTrendingDown } from 'react-icons/hi';

function StaticPageRoute({ onBack }) {
  const { slug } = useParams();
  return <StaticPage page={slug} onBack={onBack} />;
}

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialStep, setInitialStep] = useState('owner_form');
  const [pendingTransfer, setPendingTransfer] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme_mode') || 'light';
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleNavigateToDashboard = (targetStep = 'owner_form', data = null) => {
    if (data) setPendingTransfer(data);
    setInitialStep(targetStep);
    navigate('/dashboard');
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  const handleDashboardBack = () => {
    const params = new URLSearchParams({ edit: 'true' });
    if (pendingTransfer) {
      if (pendingTransfer.amount) params.append('amount', pendingTransfer.amount);
      if (pendingTransfer.from) params.append('from', pendingTransfer.from);
      if (pendingTransfer.to) params.append('to', pendingTransfer.to);
    }
    navigate(`/?${params.toString()}`);
  };

  const handlePageClick = (slug) => {
    navigate(`/p/${slug}`);
    window.scrollTo(0, 0);
  };

  const Feature = ({ icon, title, desc }) => (
    <Card sx={{ p: 4, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ fontSize: '2.5rem', mb: 2, color: 'primary.main' }}>{icon}</Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
      <Typography color="text.secondary">{desc}</Typography>
    </Card>
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Smooth scroll for editing
    if (searchParams.get('edit') === 'true') {
      const element = document.getElementById('calculator-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Auto-open login for Guest-to-User conversion
    if (searchParams.get('triggerLogin') === 'true') {
      setLoginModalOpen(true);
    }
  }, [location.search]);

  const statItems = [
    { v: '+5k', l: 'Usuarios que han usado' },
    { v: '15 min', l: 'Tiempo promedio' },
    { v: '4.8/5', l: 'Calificación' },
    { v: '100%', l: 'Seguro' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
        <Navbar
          onLoginClick={() => setLoginModalOpen(true)}
          user={user}
          logout={logout}
          mode={mode}
          onToggleMode={toggleColorMode}
          onLogoClick={() => navigate('/')}
          onPageClick={handlePageClick}
          onDashboardClick={(step) => {
            if (step === 'profile') navigate('/profile');
            else if (step === 'transactions') navigate('/transactions');
            else if (step === 'kyc') navigate('/kyc');
            else handleNavigateToDashboard(step);
          }}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, md: 10 },
            bgcolor: 'background.default',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle decorative circles - toned down */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: mode === 'light' ? 'rgba(221, 62, 0, 0.02)' : 'rgba(255, 122, 69, 0.03)', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', bottom: '20%', left: -50, width: 200, height: 200, borderRadius: '50%', background: mode === 'light' ? 'rgba(255, 122, 69, 0.03)' : 'rgba(221, 62, 0, 0.05)', zIndex: 0 }} />

          <Routes>
            <Route path="/" element={
              <Box sx={{ width: '100%' }}>
                <MarketingBanner onAction={() => setLoginModalOpen(true)} />
                <Container id="calculator-section" maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
                  <Card sx={{ p: 0, overflow: 'hidden', borderRadius: { xs: 3, md: 4 }, border: 'none', boxShadow: mode === 'light' ? '0 32px 64px -16px rgba(0,0,0,0.1)' : '0 32px 64px -16px rgba(0,0,0,0.5)', bgcolor: 'transparent' }}>
                    <Grid container>
                      <Grid item xs={12} md={6} sx={{ bgcolor: '#0b1120', p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          <Typography variant="h2" sx={{ mb: 3, color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1 }}>Envía dinero <br /><Box component="span" sx={{ color: '#ff7a45' }}>al instante</Box></Typography>
                          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9, lineHeight: 1.5, maxWidth: 440 }}>Más rápido, más seguro y siempre con la mejor tasa del mercado.</Typography>
                          <Box component="img" src="/assets/images/remesas_guy_crossed.png" sx={{ width: '100%', maxWidth: 420, borderRadius: '16px', opacity: 0.8, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))', display: { xs: 'none', md: 'block' } }} />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ bgcolor: mode === 'light' ? 'white' : 'background.paper', p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Calculator onNext={handleNavigateToDashboard} externalLoginOpen={loginModalOpen} setExternalLoginOpen={setLoginModalOpen} />
                      </Grid>
                    </Grid>
                  </Card>
                </Container>

                {/* Stats Section */}
                <Box sx={{ py: 6, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                      {statItems.map((stat, idx) => (
                        <Grid item xs={6} md={3} key={idx} textAlign="center">
                          <Typography variant="h4" fontWeight={800} color="primary.main">{stat.v}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{stat.l}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </Box>
              </Box>
            } />

            <Route path="/dashboard" element={<Dashboard onBack={handleDashboardBack} initialStep={initialStep} pendingTransfer={pendingTransfer} />} />
            <Route path="/transactions" element={<MyTransactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kyc" element={<KycVerification />} />
            <Route path="/p/:slug" element={<StaticPageRoute onBack={() => navigate('/')} />} />
          </Routes>
          <AIChatWidget />
        </Box>
        {location.pathname === '/' && <DownloadBanner />}
        <Footer onPageClick={handlePageClick} />
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
