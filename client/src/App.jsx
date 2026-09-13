import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoIntro from './components/LogoIntro';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <LogoIntro />
            <MenuPage />
          </>
        } />
        
        <Route path="/admin/*" element={
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>Admin editing is not available in this deployment.</h1>
            <p>Please run the native local Node.js application to edit the menu.</p>
            <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Return to Public Menu</a>
          </div>
        } />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;