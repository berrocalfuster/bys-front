import { useEffect, useState, useRef } from 'react';
import { 
  Box, Typography, Stack, TextField, IconButton, Paper, Avatar, Button, Card, Divider, 
  Dialog, DialogTitle, DialogContent, DialogActions, Zoom, Fab, Badge, Tooltip 
} from '@mui/material';
import { HiPaperAirplane, HiSparkles, HiXMark, HiPhoto, HiPaperClip, HiArrowPath } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { syncFullTransaction, resetTransaction } from '../store/slices/transactionSlice';
import { toggleChat, openChat, closeChat } from '../store/slices/uiSlice';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// --- Sub-component: Live Preview (Left) ---
const AITransferPreview = ({ onReset }) => {
  const transaction = useSelector(state => state.transaction);
  const { calculation, recipient, bank } = transaction;

  const DetailRow = ({ label, value, filled }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={filled ? 700 : 400} sx={{ 
        color: filled ? 'text.primary' : 'text.disabled',
        fontStyle: filled ? 'normal' : 'italic'
      }}>
        {filled ? value : '...'}
      </Typography>
    </Stack>
  );

  const formatNum = (num, digits = 0) => {
    if (!num) return '...';
    return new Intl.NumberFormat('es-CL', { 
      minimumFractionDigits: digits, 
      maximumFractionDigits: digits > 0 ? 5 : 0 
    }).format(num);
  };

  return (
    <Box sx={{ p: 3, height: '100%', bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(221, 62, 0, 0.02)' : 'rgba(255,255,255,0.03)' }}>
      <Typography variant="subtitle2" fontWeight={900} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HiSparkles color="#dd3e00" /> Tu Solicitud
      </Typography>
      
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <Box>
          <Typography variant="caption" fontWeight={800} color="primary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Cálculo</Typography>
          <DetailRow label="Envías" value={`${formatNum(calculation.amount)} ${calculation.from}`} filled={!!calculation.amount} />
          <DetailRow label="Tasa" value={formatNum(calculation.rate, 4)} filled={!!calculation.rate} />
          <DetailRow label="Recibe" value={`${formatNum(calculation.total, 2)} ${calculation.to}`} filled={!!calculation.total} />
        </Box>

        <Divider sx={{ opacity: 0.5 }} />

        <Box>
          <Typography variant="caption" fontWeight={800} color="primary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Destinatario</Typography>
          <DetailRow label="Nombre" value={`${recipient.firstName} ${recipient.lastName}`} filled={!!recipient.firstName} />
          <DetailRow label="ID" value={recipient.docNumber} filled={!!recipient.docNumber} />
        </Box>

        <Divider sx={{ opacity: 0.5 }} />

        <Box>
          <Typography variant="caption" fontWeight={800} color="primary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Banco</Typography>
          <DetailRow label="Banco" value={bank.bank} filled={!!bank.bank} />
          <DetailRow label="Cuenta" value={bank.accountNumber} filled={!!bank.accountNumber} />
        </Box>
      </Stack>

      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          color="error"
          size="small"
          startIcon={<HiArrowPath />}
          onClick={onReset}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none', 
            fontWeight: 700,
            borderColor: 'rgba(211, 47, 47, 0.2)',
            '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(211, 47, 47, 0.05)' }
          }}
        >
          Reiniciar Transacción
        </Button>
      </Box>
    </Box>
  );
};

// --- Main Widget Component ---
export default function AIChatWidget() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const transaction = useSelector(state => state.transaction);
  const isOpen = useSelector(state => state.ui.isChatOpen);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu asistente financiero. ¿A quién te gustaría enviarle dinero hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // base64
  const [isTyping, setIsTyping] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const hasData = transaction.calculation.amount || transaction.recipient.firstName || transaction.bank.bank;
      if (hasData && messages.length <= 1) {
        setShowResumeDialog(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = { role: 'user', text: inputText, image: selectedImage };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await api.post('/ai-chat', {
        message: inputText,
        currentState: transaction,
        image: userMessage.image
      });

      if (response.fieldsUpdate) {
        dispatch(syncFullTransaction(response.fieldsUpdate));
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Lo siento, hubo un error. Intentemos de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinish = () => {
    dispatch(closeChat());
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
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <Zoom in={!isOpen}>
          <Tooltip title="Asistente AI" placement="left">
            <Fab 
              color="primary" 
              onClick={() => dispatch(openChat())}
              sx={{ 
                position: 'fixed', 
                bottom: 24, 
                right: 24, 
                zIndex: 1100,
                width: 64,
                height: 64,
                boxShadow: '0 8px 32px rgba(221, 62, 0, 0.4)',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <HiSparkles size={32} />
            </Fab>
          </Tooltip>
        </Zoom>
      )}

      {/* Chat Window */}
      <Zoom in={isOpen}>
        <Paper elevation={24} sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          zIndex: 1100,
          width: { xs: 'calc(100vw - 48px)', sm: 850 },
          height: { xs: 'calc(100vh - 120px)', sm: 600 },
          borderRadius: 2.5,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
        }}>
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <HiSparkles size={24} />
              <Typography variant="subtitle1" fontWeight={800}>Asistente B&S Global Services</Typography>
            </Stack>
            <IconButton onClick={() => dispatch(closeChat())} sx={{ color: 'white' }}>
              <HiXMark />
            </IconButton>
          </Box>

          <Stack direction="row" sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {/* Left Column: Preview */}
            <Box sx={{ width: { xs: 0, sm: 300 }, display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider' }}>
              <AITransferPreview onReset={handleReset} />
            </Box>

            {/* Right Column: Chat */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
              <Box ref={scrollRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : 'background.paper' }}>
                {messages.map((m, idx) => (
                  <Box key={idx} sx={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <Paper elevation={0} sx={{ 
                      p: 1.5, 
                      borderRadius: 3, 
                      bgcolor: m.role === 'user' ? 'primary.main' : 'background.default',
                      color: m.role === 'user' ? 'white' : 'text.primary',
                      border: m.role === 'assistant' ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}>
                      {m.image && (
                        <Box component="img" src={m.image} sx={{ width: '100%', maxWidth: 200, borderRadius: 2, mb: 1, display: 'block' }} />
                      )}
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.text}</Typography>
                    </Paper>
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ alignSelf: 'flex-start' }}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" spacing={0.5}>
                        <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.1s' }} />
                        <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                        <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.3s' }} />
                      </Stack>
                    </Paper>
                  </Box>
                )}
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                />
                
                {selectedImage && (
                  <Box sx={{ mb: 1, position: 'relative', width: 60, height: 60 }}>
                    <Box component="img" src={selectedImage} sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: 'cover', border: '2px solid', borderColor: 'primary.main' }} />
                    <IconButton 
                      size="small" 
                      onClick={() => setSelectedImage(null)}
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, p: 0.5 }}
                    >
                      <HiXMark size={14} />
                    </IconButton>
                  </Box>
                )}

                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => fileInputRef.current?.click()} color="primary" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <HiPhoto size={20} />
                  </IconButton>
                  <TextField 
                    fullWidth 
                    size="small"
                    placeholder="Pregúntame lo que sea..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <IconButton onClick={handleSendMessage} color="primary" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 3 }}>
                    <HiPaperAirplane size={20} style={{ transform: 'rotate(-45deg)' }} />
                  </IconButton>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleFinish}
                    sx={{ 
                      borderRadius: 3, 
                      fontWeight: 800, 
                      textTransform: 'none', 
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                      ...(transaction.calculation.amount && transaction.recipient.firstName && transaction.bank.bank ? {
                        background: 'linear-gradient(-45deg, #2e7d32, #4caf50, #a5d6a7, #4caf50)',
                        backgroundSize: '400% 400%',
                        animation: 'pulse-green 2s infinite, gradient-move 3s ease infinite',
                        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
                        '@keyframes pulse-green': {
                          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)' },
                          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(46, 125, 50, 0)' },
                          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(46, 125, 50, 0)' }
                        },
                        '@keyframes gradient-move': {
                          '0%': { backgroundPosition: '0% 50%' },
                          '50%': { backgroundPosition: '100% 50%' },
                          '100%': { backgroundPosition: '0% 50%' }
                        }
                      } : {})
                    }}
                  >
                    Finalizar
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Stack>

        </Paper>
      </Zoom>

      {/* Resume Dialog - Moved outside to guarantee top-level z-index */}
      <Dialog 
        open={showResumeDialog} 
        onClose={() => setShowResumeDialog(false)} 
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        sx={{ zIndex: 10000 }} // Ensure it's above the chat window (9999)
      >
        <DialogTitle sx={{ fontWeight: 900 }}>¿Retomar anterior?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">Detectamos una cotización pendiente. ¿Deseas continuar con ella o empezar una nueva?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleReset} variant="outlined" sx={{ borderRadius: 2, fontWeight: 700 }}>Nueva</Button>
          <Button onClick={handleResume} variant="contained" sx={{ borderRadius: 2, fontWeight: 800 }}>Continuar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
