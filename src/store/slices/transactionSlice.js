import { createSlice } from '@reduxjs/toolkit';

const getSavedState = () => {
    try {
        const saved = localStorage.getItem('llanuda_pending_tx');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
};

const DEFAULT_STATE = {
  calculation: {
    from: 'USD',
    to: 'VES',
    amount: '',
    total: 0,
    rate: 0,
    fee: 0,
  },
  recipient: {
    firstName: '',
    lastName: '',
    docType: 'V',
    docNumber: '',
    nickname: '',
    saveRecipient: false,
  },
  bank: {
    bank: '',
    isPagoMovil: 'no',
    accountType: '',
    accountNumber: '',
  },
  status: 'idle', // idle, calculating, chat_active, complete
  error: null,
};

const savedState = getSavedState();
const initialState = savedState || DEFAULT_STATE;

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    updateCalculation: (state, action) => {
      state.calculation = { ...state.calculation, ...action.payload };
    },
    updateRecipient: (state, action) => {
      state.recipient = { ...state.recipient, ...action.payload };
    },
    updateBank: (state, action) => {
      state.bank = { ...state.bank, ...action.payload };
    },
    resetTransaction: (state) => {
      return DEFAULT_STATE;
    },
    setTransactionStatus: (state, action) => {
      state.status = action.payload;
    },
    // For AI to push multiple updates at once
    syncFullTransaction: (state, action) => {
      const { calculation, recipient, bank } = action.payload;
      if (calculation) state.calculation = { ...state.calculation, ...calculation };
      if (recipient) state.recipient = { ...state.recipient, ...recipient };
      if (bank) state.bank = { ...state.bank, ...bank };
    }
  },
});

export const { 
  updateCalculation, 
  updateRecipient, 
  updateBank, 
  resetTransaction, 
  setTransactionStatus,
  syncFullTransaction 
} = transactionSlice.actions;

export default transactionSlice.reducer;
