import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // or './App.css' if you prefer
import Header from './components/Header';
import { UserContextProvider } from './UserContext'; // Ensure this import is correct

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Header />
      <UserContextProvider>
        
        <App />
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
