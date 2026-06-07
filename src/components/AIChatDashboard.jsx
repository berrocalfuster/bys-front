import { useEffect, useState, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack, TextField, IconButton, Paper, Avatar, Button, Card, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { HiPaperAirplane, HiInformationCircle, HiSparkles, HiArrowSmallLeft } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { syncFullTransaction, resetTransaction } from '../store/slices/transactionSlice';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// --- Sub-component: Live Preview (Left) ---
const AITransferPreview = () => {
  const transaction = useSelector(state => state.transaction);
  const { calculation, recipient, bank } = transaction;

  const DetailRow = ({ label, value, filled }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={filled ? 700 : 400} sx={{ 
        color: filled ? 'text.primary' : 'text.disabled',
        fontStyle: filled ? 'normal' : 'italic'
      }}>
        {filled ? value : 'Pendiente...'}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ p: 4, height: '100%' }}>
      <Typography variant="h5" fontWeight={900} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HiSparkles color="#dd3e00" /> Tu Solicitud
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        La IA está construyendo tu transferencia automáticamente.
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="overline" fontWeight={800} color="primary" sx={{ mb: 1, display: 'block' }}>Cálculo</Typography>
          <DetailRow label="Monto a enviar" value={`${calculation.amount} ${calculation.from}`} filled={!!calculation.amount} />
          <DetailRow label="Tasa aplicada" value={calculation.rate} filled={!!calculation.rate} />
          <DetailRow label="Recibe" value={`${calculation.total} ${calculation.to}`} filled={!!calculation.total} />
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" fontWeight={800} color="primary" sx={{ mb: 1, display: 'block' }}>Destinatario</Typography>
          <DetailRow label="Nombre" value={`${recipient.firstName} ${recipient.lastName}`} filled={!!recipient.firstName} />
          <DetailRow label="Identificación" value={`${recipient.docType}-${recipient.docNumber}`} filled={!!recipient.docNumber} />
          <DetailRow label="Apodo" value={recipient.nickname} filled={!!recipient.nickname} />
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" fontWeight={800} color="primary" sx={{ mb: 1, display: 'block' }}>Banco</Typography>
          <DetailRow label="Banco" value={bank.bank} filled={!!bank.bank} />
          <DetailRow label="Tipo de cuenta" value={bank.accountType} filled={!!bank.accountType} />
          <DetailRow label="Número" value={bank.accountNumber} filled={!!bank.accountNumber} />
        </Box>
      </Stack>
    </Box>
  );
};

// --- Main Layout ---
export default function AIChatDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const transaction = useSelector(state => state.transaction);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu asistente financiero. ¿A quién te gustaría enviarle dinero hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Check if there's significant data in Redux to offer resume
    const hasData = transaction.calculation.amount || transaction.recipient.firstName || transaction.bank.bank;
    if (hasData) {
      setShowResumeDialog(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

      // Pass history to backend for context
      const history = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await api.post('/ai-chat', {
        message: inputText,
        history,
        currentState: transaction
      });

      if (response.fieldsUpdate) {
        dispatch(syncFullTransaction(response.fieldsUpdate));
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Lo siento, hubo un error procesando tu solicitud. Intentemos de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinish = () => {
    if (user) {
      navigate('/dashboard'); 
    } else {
      navigate('/?triggerLogin=true');
    }
  };

  const handleReset = () => {
    dispatch(resetTransaction());
    setShowResumeDialog(false);
    setMessages([{ role: 'assistant', text: '¡Hola! Empecemos de nuevo. ¿A quién te gustaría enviarle dinero hoy?' }]);
  };

  const handleResume = () => {
    setShowResumeDialog(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex' }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          
          {/* Left Side: Preview */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ 
              height: '100%', 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              overflow: 'hidden',
              background: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(11, 17, 32, 0.4)',
              backdropFilter: 'blur(10px)'
            }}>
              <AITransferPreview />
            </Paper>
          </Grid>

          {/* Right Side: Chat */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <HiSparkles />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>Chat Asistido</Typography>
                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} /> Agente en Línea
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="text" size="small" startIcon={<HiArrowSmallLeft />} onClick={() => navigate('/')}>Salir</Button>
              </Box>

              {/* Messages Area */}
              <Box ref={scrollRef} sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((m, idx) => (
                  <Box key={idx} sx={{ 
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: m.role === 'user' ? 'primary.main' : 'action.hover',
                      color: m.role === 'user' ? 'white' : 'text.primary',
                      borderBottomRightRadius: m.role === 'user' ? 2 : 12,
                      borderBottomLeftRadius: m.role === 'assistant' ? 2 : 12,
                    }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{m.text}</Typography>
                    </Paper>
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ alignSelf: 'flex-start' }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.1s' }} />
                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                        <Box sx={{ width: 6, height: 6, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.3s' }} />
                      </Stack>
                    </Paper>
                  </Box>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                <Stack direction="row" spacing={2}>
                  <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Escribe tu mensaje..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'background.paper'
                      }
                    }}
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 56, height: 56, '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 3 }}
                  >
                    <HiPaperAirplane style={{ transform: 'rotate(-45deg)' }} />
                  </IconButton>

                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleFinish}
                    sx={{ 
                      borderRadius: 3, 
                      px: 3, 
                      height: 56, 
                      boxShadow: 'none', 
                      textTransform: 'none', 
                      fontWeight: 800, 
                      fontSize: '0.95rem', 
                      whiteSpace: 'nowrap',
                      minWidth: 'max-content'
                    }}
                  >
                    Finalizar y Enviar
                  </Button>
                </Stack>
                <Typography variant="caption" color="text.disabled" textAlign="center" sx={{ display: 'block', mt: 2 }}>
                  Toda la información proporcionada está protegida por encriptación avanzada.
                </Typography>
              </Box>


              {/* Resume Dialog */}

              {/* Resume Dialog */}
              <Dialog 
                open={showResumeDialog} 
                onClose={() => setShowResumeDialog(false)}
                PaperProps={{ sx: { borderRadius: 4, px: 3, py: 2, backdropFilter: 'blur(10px)', bgcolor: 'rgba(255,255,255,0.95)' } }}
              >
                <DialogTitle sx={{ fontWeight: 900, textAlign: 'center', fontSize: '1.5rem' }}>
                  ¿Retomar cotización anterior?
                </DialogTitle>
                <DialogContent>
                  <Typography color="text.secondary" textAlign="center">
                    Tienes una transferencia en curso. ¿Deseas continuar con ella o empezar una nueva desde cero?
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleReset}
                    sx={{ borderRadius: 99, px: 3, fontWeight: 700 }}
                  >
                    Nueva desde cero
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleResume}
                    sx={{ borderRadius: 99, px: 4, fontWeight: 800 }}
                  >
                    Continuar anterior
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
