
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      // Use 'authToken' aqui também
      const token = localStorage.getItem('authToken'); 
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
            localStorage.setItem('userData', JSON.stringify(data.user));
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para a raiz (página de login)
    return <Navigate to="/" state={{ from: location }} replace />; 
  }

  return children;
};

export default ProtectedRoute;