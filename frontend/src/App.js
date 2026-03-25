import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import CustomCursor from "./components/CustomCursor";
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import '@/App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Custom Translucent Cursor (global) */}
      <CustomCursor />

      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
