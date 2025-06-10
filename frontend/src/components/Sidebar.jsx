// src/assets/components/Sidebar.jsx

import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  MapPin,
  Users,
  Settings,
  LogOut,
  MessageCircle,
  Luggage,
  CircleUserRound
} from "lucide-react";

import Modal from './Modal'; // CONFIRME este caminho (se estiver incorreto, corrija)
import '/src/assets/style/sidebar.css'; // CONFIRME este caminho (se estiver incorreto, corrija)

function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("handleLogout: Tentando deslogar..."); // Log de depuração
    // Lógica real de logout aqui:
    // *** MUITO IMPORTANTE: Mude 'userToken' para 'authToken' ***
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userData'); // Remova outros dados do usuário, se você os armazena

    setShowLogoutModal(false); // Fecha o modal
    
    // Redireciona para a rota raiz ('/'), que é seu Index.jsx (página de login)
    navigate('/'); 
    console.log("handleLogout: Redirecionamento para / solicitado."); // Log de depuração
  };

  return (
    <aside className="h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between
      w-20 md:w-64 transition-all duration-300 sidebar">

      {/* Cabeçalho (sem alterações, mantido do seu código) */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Luggage className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
            TravelConnect
          </h1>
        </div>

        {/* Menu Principal (sem alterações, mantido do seu código) */}
        <nav className="space-y-2">
          {/* Confirme se essas rotas são as que você quer que levem */}
          <SidebarItem icon={Home} label="Início" to="/home" /> 
          {/* Se a rota '/' é o login (Index.jsx), Explorar não deve apontar para ela.
             Se você tem uma página "Explorar" protegida, ajuste o `to`.
             Se "Explorar" é uma página pública diferente do login, defina outra rota.
             Por agora, vou manter o 'to="/"' mas com a ressalva de que não faz sentido levar para a tela de login.
             Se 'Explorar' na sidebar é uma página protegida, deveria ser tipo '/explorer'
          */}
          <SidebarItem icon={Compass} label="Explorar" to="/explorer" /> {/* Ajustado para uma rota mais lógica */}
          <SidebarItem icon={MapPin} label="Roteiros" to="/itineraries" />
          <SidebarItem icon={MessageCircle} label="Comunidade" to="/community" />
          <SidebarItem icon={Users} label="Amigos" to="/friends" />
        </nav>
      </div>

      {/* Rodapé (alterações apenas na lógica do botão Sair e adição de logs) */}
      <div className="p-4 border-t border-gray-100">
        <SidebarItem icon={CircleUserRound} label="Perfil" to="/perfil" />
        <SidebarItem icon={Settings} label="Configurações" to="/settings" />

        {/* Item "Sair" - Abre o modal */}
        <button
          onClick={() => {
            console.log("Botão Sair na Sidebar clicado. Abrindo modal."); // Log de depuração
            setShowLogoutModal(true);
          }}
          className={`group flex items-center w-full px-3 py-3 rounded-lg transition-colors
            text-gray-600 hover:bg-gray-50`}
        >
          <div className="relative flex items-center justify-center md:justify-start w-full">
            <LogOut className="w-7 h-7 text-gray-400" />
            <span className="ml-3 text-sm hidden md:block">Sair</span>
            <span className="md:hidden absolute left-full ml-4 px-2 py-1 text-sm text-white bg-gray-800 rounded-md
              opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
              Sair
            </span>
          </div>
        </button>
      </div>

      {/* Componente Modal de Confirmação de Saída */}
      <Modal
        show={showLogoutModal}
        onClose={() => {
          console.log("Modal fechado sem confirmar saída."); // Log de depuração
          setShowLogoutModal(false);
        }}
        title="Confirmar Saída"
        footer={
          <>
            <button className="button-cancel" onClick={() => {
              console.log("Botão Cancelar no modal clicado."); // Log de depuração
              setShowLogoutModal(false);
            }}>Cancelar</button>
            <button className="button-confirm" onClick={() => {
              console.log("Botão Sair no modal clicado. Chamando handleLogout()."); // Log de depuração
              handleLogout(); // AQUI é onde a função de logout é chamada
            }}>Sair</button>
          </>
        }
      >
        <p>Você tem certeza que deseja sair da sua conta?</p>
      </Modal>
    </aside>
  );
}

// SidebarItem (sem alterações, mantido do seu código)
function SidebarItem({ icon: Icon, label, to = "#", className = "" }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`group flex items-center w-full px-3 py-3 rounded-lg transition-colors
        ${isActive
          ? "text-teal-600 bg-blue-50 font-medium"
          : "text-gray-600 hover:bg-gray-50"}
        ${className}`}
    >
      <div className="relative flex items-center justify-center md:justify-start w-full">
        <Icon className={`w-7 h-7 ${isActive ? 'text-teal-500' : 'text-gray-400'}`} />
        <span className="ml-3 text-sm hidden md:block">{label}</span>
        {isActive && (
          <div className="ml-auto w-1.5 h-4 bg-teal-500 rounded-full hidden md:block" />
        )}
        <span className="md:hidden absolute left-full ml-4 px-2 py-1 text-sm text-white bg-gray-800 rounded-md
          opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default Sidebar;