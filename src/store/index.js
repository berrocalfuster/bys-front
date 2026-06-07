import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    ui: uiReducer,
  },
  // Persist state to session storage or local storage simple way for now
  // or I could add redux-persist later. 
  // Let's do a simple manual hydration/dehydration if needed, 
  // but for now standard store is enough as we are setting up.
});

// Simple persistence to localStorage
store.subscribe(() => {
  localStorage.setItem('llanuda_pending_tx', JSON.stringify(store.getState().transaction));
});

// Initial hydration could be done here or in the slice initialState
