import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client'
// import reportWebVitals from './reportWebVitals';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/*
Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/