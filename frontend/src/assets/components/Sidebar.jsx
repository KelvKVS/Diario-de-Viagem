import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, User, LogIn, Star, BarChart } from 'lucide-react';
import '../style/Sidebar.css';


const Sidebar = () => {
  return (
    <div className="sidebar">
      <button className="hover:bg-blue-600 p-2 rounded">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <Link to="/" className="hover:bg-blue-600 p-2 rounded">
        <Home className="w-6 h-6" />
      </Link>
      <Link to="/nova-viagem" className="hover:bg-blue-600 p-2 rounded">
        <Plus className="w-6 h-6" />
      </Link>
      <Link to="/newpost" className="hover:bg-blue-600 p-2 rounded">
        <BarChart className="w-6 h-6" />
      </Link>
      <Link to="/userprofile" className="hover:bg-blue-600 p-2 rounded">
        <User className="w-6 h-6" />
      </Link>
      <Link to="/login" className="hover:bg-blue-600 p-2 rounded">
        <LogIn className="w-6 h-6" />
      </Link>
      <Link to="/favoritos" className="hover:bg-blue-600 p-2 rounded">
        <Star className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Sidebar;
