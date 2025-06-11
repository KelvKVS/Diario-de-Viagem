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

import Modal from './Modal';
import '/src/assets/style/sidebar.css';
import apiService from '../services/api';

function Sidebar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        apiService.clearAuth();
        setShowLogoutModal(false);
        navigate('/');
    };

    return (
        <aside className="h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between
            w-20 md:w-64 transition-all duration-300 ease-in-out sidebar hover:shadow-md">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-8 justify-center md:justify-start group">
                    <div className="p-2 bg-blue-50 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Luggage className="w-8 h-8 text-teal-600 transition-colors duration-300 group-hover:text-teal-500" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800 hidden md:block transition-all duration-300 transform group-hover:translate-x-1">
                        TravelConnect
                    </h1>
                </div>

                <nav className="space-y-2">
                    <SidebarItem icon={Home} label="Início" to="/home" /> 
                    <SidebarItem icon={Compass} label="Explorar" to="/explorer" />
                    <SidebarItem icon={MapPin} label="Roteiros" to="/itineraries" />
                    <SidebarItem icon={MessageCircle} label="Comunidade" to="/community" />
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
                <SidebarItem icon={CircleUserRound} label="Perfil" to="/profile" />
                <SidebarItem icon={Settings} label="Configurações" to="/settings" />

                <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`group flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300
                        text-gray-600 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]`}
                >
                    <div className="relative flex items-center justify-center md:justify-start w-full">
                        <LogOut className="w-7 h-7 text-gray-400 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="ml-3 text-sm hidden md:block transition-all duration-300 group-hover:translate-x-1">Sair</span>
                        <span className="md:hidden absolute left-full ml-4 px-2 py-1 text-sm text-white bg-gray-800 rounded-md
                            opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 shadow-md pointer-events-none">
                            Sair
                        </span>
                    </div>
                </button>
            </div>

            <Modal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirmar Saída"
                footer={
                    <>
                        <button className="button-cancel" onClick={() => setShowLogoutModal(false)}>
                            Cancelar
                        </button>
                        <button className="button-confirm" onClick={handleLogout}>
                            Sair
                        </button>
                    </>
                }
            >
                <p>Você tem certeza que deseja sair da sua conta?</p>
            </Modal>
        </aside>
    );
}

function SidebarItem({ icon: Icon, label, to = "#", className = "" }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`group flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300
                ${isActive
                    ? "text-teal-600 bg-blue-50 font-medium scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:scale-[1.02]"}
                active:scale-[0.98] ${className}`}
        >
            <div className="relative flex items-center justify-center md:justify-start w-full">
                <Icon className={`w-7 h-7 transition-all duration-300 
                    ${isActive ? 'text-teal-500 scale-110' : 'text-gray-400 group-hover:scale-110'}`} />
                <span className="ml-3 text-sm hidden md:block transition-all duration-300 group-hover:translate-x-1">{label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-4 bg-teal-500 rounded-full hidden md:block transition-all duration-300 scale-y-110" />
                )}
                <span className="md:hidden absolute left-full ml-4 px-2 py-1 text-sm text-white bg-gray-800 rounded-md
                    opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 shadow-md pointer-events-none">
                    {label}
                </span>
            </div>
        </Link>
    );
}

export default Sidebar;