import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router } from "react-router-dom";
import {ChatProvider} from './components/ChatContext'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ChatProvider>
        <App />
      </ChatProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
