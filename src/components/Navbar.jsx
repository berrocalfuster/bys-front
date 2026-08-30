import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Stack,
    Typography,
    useScrollTrigger,
    useTheme,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
    Drawer,
    Divider
} from '@mui/material';
import { cloneElement, useState } from 'react';
import { HiSun, HiMoon, HiMenu, HiUserCircle, HiX } from 'react-icons/hi';
import { MdAccountBalanceWallet, MdLogout, MdPerson, MdReceipt, MdVerified } from 'react-icons/md';
import { HiShieldCheck, HiOutlineArchiveBox, HiOutlineMapPin } from 'react-icons/hi2';

function ElevationScroll({ children }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return cloneElement(children, {
        elevation: 0,
        sx: {
            bgcolor: trigger
                ? (isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)')
                : 'transparent',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            color: 'text.primary',
            borderBottom: trigger
                ? (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)')
                : 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: trigger
                ? (isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(221, 62, 0, 0.05)')
                : 'none',
        }
    });
}

export default function Navbar({ onLoginClick, user, logout, mode, onToggleMode, onLogoClick, onPageClick, onDashboardClick, onCalculatorClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuOpen = (event) => {
        if (!user) {
            onLoginClick();
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const navItems = [
        { label: 'Inicio', action: onLogoClick },
        { label: 'Paquetería', action: () => onPageClick('paqueteria') },
        { label: 'Calculadora', action: onCalculatorClick },
        { label: 'Sobre B&S Global Services', action: () => onPageClick('nosotros') },
        { label: 'Contacto', action: () => onPageClick('contacto') },
    ];

    const isKycApproved = user?.kycStatus === 'approved';

    return (
        <>
        <ElevationScroll>
            <AppBar position="fixed" color="inherit">
                <Container maxWidth="lg">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ height: { xs: 64, md: 80 } }}
                    >
                        {/* Logo */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ cursor: 'pointer' }}
                            onClick={onLogoClick}
                        >
                            <Box
                                component="img"
                                src="/assets/images/logo-bys-oficial.jpg"
                                alt="B&S Global Services LLC"
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    boxShadow: '0 8px 16px rgba(221, 62, 0, 0.2)'
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 900,
                                    letterSpacing: '-1px',
                                    display: { xs: 'none', sm: 'block' },
                                    background: 'linear-gradient(45deg, #dd3e00, #ff7a45)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: mode === 'light' ? 'transparent' : 'inherit'
                                }}
                            >
                                B&S Global Services
                            </Typography>
                        </Stack>

                        {/* Navigation */}
                        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    color="inherit"
                                    onClick={item.action}
                                    sx={{
                                        fontWeight: 600,
                                        opacity: 0.8,
                                        '&:hover': { opacity: 1, bgcolor: 'transparent', color: 'primary.main' }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>

                        {/* Actions */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton onClick={onToggleMode} color="inherit" sx={{ mr: 1 }}>
                                {mode === 'light' ? <HiMoon /> : <HiSun />}
                            </IconButton>

                            {/* KYC Verified Badge */}
                            {user && isKycApproved && (
                                <Tooltip title="Identidad Verificada" arrow>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        bgcolor: 'success.main',
                                        color: 'white',
                                        borderRadius: 99,
                                        px: 1.2,
                                        py: 0.4,
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        cursor: 'default',
                                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                        animation: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
                                            transform: 'scale(1.05)'
                                        }
                                    }}>
                                        <MdVerified size={16} />
                                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>KYC</Box>
                                    </Box>
                                </Tooltip>
                            )}

                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{
                                    bgcolor: mode === 'light' ? 'rgba(221, 62, 0, 0.05)' : 'rgba(255,255,255,0.05)',
                                    color: mode === 'light' ? 'primary.main' : 'white',
                                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <HiUserCircle size={24} />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        borderRadius: 2,
                                        minWidth: 200,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => { handleMenuClose(); onDashboardClick('profile'); }} sx={{ py: 1.5, gap: 1.5 }}>
                                    <MdPerson size={20} style={{ opacity: 0.6 }} />
                                    <Typography variant="body2" fontWeight={700}>Mi Perfil</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); onDashboardClick('transactions'); }} sx={{ py: 1.5, gap: 1.5 }}>
                                    <MdReceipt size={20} style={{ opacity: 0.6 }} />
                                    <Typography variant="body2" fontWeight={700}>Mis Transacciones</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); onDashboardClick('casillero'); }} sx={{ py: 1.5, gap: 1.5 }}>
                                    <HiOutlineArchiveBox size={20} style={{ opacity: 0.6 }} />
                                    <Typography variant="body2" fontWeight={700}>Mi Casillero</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); onDashboardClick('envios'); }} sx={{ py: 1.5, gap: 1.5 }}>
                                    <HiOutlineMapPin size={20} style={{ opacity: 0.6 }} />
                                    <Typography variant="body2" fontWeight={700}>Mis Envíos</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); onDashboardClick('kyc'); }} sx={{ py: 1.5, gap: 1.5 }}>
                                    {isKycApproved ? (
                                        <MdVerified size={20} style={{ color: '#16a34a' }} />
                                    ) : (
                                        <HiShieldCheck size={20} style={{ opacity: 0.6 }} />
                                    )}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body2" fontWeight={700}>
                                            {isKycApproved ? 'Identidad Verificada' : 'Verificar Identidad'}
                                        </Typography>
                                        {!isKycApproved && (
                                            <Chip label="Nuevo" size="small" color="info" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
                                        )}
                                    </Stack>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => { handleMenuClose(); logout(); }}
                                    sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}
                                >
                                    <MdLogout size={20} style={{ opacity: 0.8 }} />
                                    <Typography variant="body2" fontWeight={700}>Cerrar Sesión</Typography>
                                </MenuItem>
                            </Menu>

                            <IconButton sx={{ display: { md: 'none' } }} color="inherit" onClick={() => setMobileOpen(true)}>
                                <HiMenu />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </AppBar>
        </ElevationScroll>

            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 260, pt: 2 }} role="presentation">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pb: 1 }}>
                        <Typography fontWeight={800}>Menú</Typography>
                        <IconButton onClick={() => setMobileOpen(false)}>
                            <HiX />
                        </IconButton>
                    </Stack>
                    <Divider />
                    <Stack sx={{ py: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => { setMobileOpen(false); item.action(); }}
                                sx={{
                                    justifyContent: 'flex-start',
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 0,
                                    fontWeight: 600,
                                    color: 'text.primary',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
}
