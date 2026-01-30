import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: 'Dashboard', active: true },
    { icon: <Users size={20}/>, label: 'Teachers', active: false },
    { icon: <BookOpen size={20}/>, label: 'Courses', active: false },
    { icon: <Settings size={20}/>, label: 'Settings', active: false },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="text-2xl font-bold mb-10 px-2 text-blue-400">EduDash Pro</div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;