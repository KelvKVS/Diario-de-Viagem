import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/Index';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import '/src/assets/style/app.css';

function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 bg-gray-50 min-h-screen`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explorer" element={<h1 className="text-xl">Explorar Viagens</h1>} />
          <Route path="/itineraries" element={<h1 className="text-xl">Roteiros</h1>} />
          <Route path="/community" element={<h1 className="text-xl">Comunidade</h1>} />
          <Route path="/groups" element={<h1 className="text-xl">Grupos</h1>} />
          <Route path="/settings" element={<h1 className="text-xl">Configurações</h1>} />
          <Route path="*" element={<h1 className="text-xl">404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;