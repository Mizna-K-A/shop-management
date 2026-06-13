import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'billing', label: 'Billing', icon: '🧾' },
    { id: 'items', label: 'Items', icon: '📋' },
    { id: 'files', label: 'Files', icon: '📁' }
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 print:hidden flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">Item Manager</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Admin Panel</p>
      </div>
      
      <nav className="mt-2 flex-1 flex flex-col gap-1 px-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] transform scale-[1.02]'
                : 'text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;