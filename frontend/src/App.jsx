import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/Index';
import Explorer from './pages/Explorer';
import TripPage from './pages/TripPage';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import '/src/assets/style/app.css';

function LogoutRoute() {
  React.useEffect(() => {
    apiService.clearAuth();
  }, []);
  return <Navigate to="/" replace />; 
}

function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar */}
      {showSidebar && (
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      <main className={`flex-1 bg-gray-50 min-h-screen ${showSidebar ? 'md:ml-20 lg:ml-64' : ''}`}>
        {/* Mobile Header */}
        {showSidebar && (
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-4 text-lg font-semibold">
              {location.pathname === '/home' && 'Home'}
              {location.pathname === '/explorer' && 'Explorar'}
              {location.pathname === '/profile' && 'Perfil'}
              {location.pathname.startsWith('/trip/') && 'Viagem'}
            </h1>
          </div>
        )}

        {/* Main Content */}
        <div className={`${showSidebar ? 'pt-16 md:pt-0' : ''}`}>
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
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <h1 className="text-xl">Configurações</h1>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
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