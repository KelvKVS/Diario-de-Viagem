import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100 px-4 py-12">
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-blue-400/30 to-teal-300/20 rounded-full blur-3xl z-0"></div>
        <div className="z-10 flex flex-col items-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" fill="#fff" stroke="#38bdf8" strokeWidth="8" />
            <path d="M40 80 Q60 100 80 80" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="55" r="6" fill="#0ea5e9" />
            <circle cx="70" cy="55" r="6" fill="#0ea5e9" />
          </svg>
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mt-6 mb-2 select-none">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">Página não encontrada</h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Opa! Parece que você se perdeu na viagem.<br />
            A página que você procura não existe ou foi movida.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
} 