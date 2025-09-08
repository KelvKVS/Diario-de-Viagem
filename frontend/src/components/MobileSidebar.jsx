import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Compass,
    MapPin,
    Users,
    Settings,
    LogOut,
    X,
    MessageCircle,
    Luggage,
    CircleUserRound
} from 'lucide-react';
import apiService from '../services/api';

function MobileSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        apiService.clearAuth();
        navigate('/');
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ease-in-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <Luggage className="w-8 h-8 text-teal-600 transition-colors duration-300 group-hover:text-teal-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 transition-all duration-300 transform group-hover:translate-x-1">
                                TravelConnect
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <X className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 space-y-2">
                            <SidebarItem icon={Home} label="Início" to="/home" onClose={onClose} />
                            <SidebarItem icon={Compass} label="Explorar" to="/explorer" onClose={onClose} />
                            <SidebarItem icon={MapPin} label="Roteiros" to="/itineraries" onClose={onClose} />
                            <SidebarItem icon={MessageCircle} label="Comunidade" to="/community" onClose={onClose} />
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <SidebarItem icon={CircleUserRound} label="Perfil" to="/profile" onClose={onClose} />
                        <SidebarItem icon={Settings} label="Configurações" to="/settings" onClose={onClose} />
                        <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-center w-full">
                                <LogOut className="w-7 h-7 text-gray-400 transition-transform duration-300 group-hover:rotate-12" />
                                <span className="ml-3 text-sm transition-all duration-300 group-hover:translate-x-1">Sair</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function SidebarItem({ icon: Icon, label, to = "#", onClose }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClose}
            className={`group flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300
                ${isActive
                    ? "text-teal-600 bg-blue-50 font-medium scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:scale-[1.02]"}
                active:scale-[0.98]`}
        >
            <div className="flex items-center w-full">
                <Icon className={`w-7 h-7 transition-all duration-300 
                    ${isActive ? 'text-teal-500 scale-110' : 'text-gray-400 group-hover:scale-110'}`} />
                <span className="ml-3 text-sm transition-all duration-300 group-hover:translate-x-1">{label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-4 bg-teal-500 rounded-full transition-all duration-300 scale-y-110" />
                )}
            </div>
        </Link>
    );
}

export default MobileSidebar; 