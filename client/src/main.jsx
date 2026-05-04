import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#dcfce7',
              color: '#16a34a',
              fontWeight: '600',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              fontWeight: '600',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </Provider>
);