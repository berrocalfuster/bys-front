import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import './index.css';
import App from './App.jsx';
import theme from './theme.js';

const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        minHeight: '100vh',
        background:
          'radial-gradient(1200px 600px at 0% 0%, #f6f7ff 0%, #eef2fb 42%, #e7eef8 100%)',
      },
      '#root': {
        width: '100%',
      },
    }}
  />
);

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
