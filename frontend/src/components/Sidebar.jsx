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

function Sidebar() {
  return (
    <aside className="h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between
      w-20 md:w-64 transition-all duration-300">

      {/* Cabeçalho */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Luggage className="w-8 h-8 text-teal-600" /> {/* Ícone fixo maior */}
          </div>
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
            TravelConnect
          </h1>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <SidebarItem icon={Home} label="Início" to="/home" />
          <SidebarItem icon={Compass} label="Explorar" to="/explore" />
          <SidebarItem icon={MapPin} label="Roteiros" to="/itineraries" />
          <SidebarItem icon={MessageCircle} label="Comunidade" to="/community" />
          <SidebarItem icon={Users} label="Grupos" to="/groups" />
        </nav>
      </div>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-100">
        <SidebarItem icon={CircleUserRound} label="Perfil" to="/perfil" />
        <SidebarItem icon={Settings} label="Configurações" to="/settings" />
        <SidebarItem
          icon={LogOut}
          label="Sair"
          to="/logout"
        />
      </div>
    </aside>
  );
}

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
        {/* Ícone com tamanho fixo */}
        <Icon className={`w-7 h-7 ${isActive ? 'text-teal-500' : 'text-gray-400'}`} />

        {/* Label visível apenas em desktop */}
        <span className="ml-3 text-sm hidden md:block">{label}</span>

        {/* Indicador de ativo para desktop */}
        {isActive && (
          <div className="ml-auto w-1.5 h-4 bg-teal-500 rounded-full hidden md:block" />
        )}

        {/* Tooltip para mobile */}
        <span className="md:hidden absolute left-full ml-4 px-2 py-1 text-sm text-white bg-gray-800 rounded-md
          opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default Sidebar;