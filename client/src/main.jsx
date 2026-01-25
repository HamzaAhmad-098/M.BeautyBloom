import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import '@/styles/globals.css'; // Add this line - import the new globals.css
import '@/styles/animation.css'; // If you have animations.css
import { store } from './store/store.js';
import '@/styles/utilities.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* REMOVE this Toaster component - it's now in App.jsx */}
        {/* <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        /> */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);