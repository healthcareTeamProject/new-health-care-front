import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Healthcare from './Healthcare';
import { BrowserRouter } from 'react-router-dom';
import TopBar from './layouts/Topbar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar />
      <Healthcare />
    </BrowserRouter>
  </React.StrictMode>
);
