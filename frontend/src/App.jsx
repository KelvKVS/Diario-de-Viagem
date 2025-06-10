import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/Index';
import Explorer from './pages/Explorer';
import TripPage from './pages/TripPage';
import Friends from './pages/Friends';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import '/src/assets/style/app.css';

// Componente para lidar com o logout
function LogoutRoute() {
  React.useEffect(() => {
    localStorage.clear(); // Limpa TODOS os dados do localStorage (incluindo 'authToken')
    console.log("localStorage limpo. Redirecionando para a página de login (Index).");
  }, []);
  return <Navigate to="/" replace />; 
}


function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/'; 

  return (
    <div className="flex">
      {showSidebar && <Sidebar />} 
      <main className={`flex-1 bg-gray-50 min-h-screen`}>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/logout" element={<LogoutRoute />} />
        
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/explorer" element={
            <ProtectedRoute>
              <Explorer />
            </ProtectedRoute>
          } />
          <Route path="/trip/:tripId" element={
            <ProtectedRoute>
              <TripPage />
            </ProtectedRoute>
          } />
          {/* Adicione as rotas para os outros itens da sua Sidebar aqui, dentro de ProtectedRoute */}
          <Route path="/itineraries" element={
            <ProtectedRoute>
              <h1 className="text-xl">Roteiros</h1>
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <h1 className="text-xl">Comunidade</h1>
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <h1 className="text-xl">Configurações</h1>
            </ProtectedRoute>
          } />
          {/* Se você tiver uma rota para "Perfil" na Sidebar: */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <h1 className="text-xl">Perfil</h1> {/* Ou seu componente de perfil */}
            </ProtectedRoute>
          } />
          
          {/* Rota catch-all: Se o usuário tentar acessar uma URL que não existe ou
              que não é uma rota pública, redireciona para a página de login (Index). */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Componente App (wrapper para BrowserRouter)
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;