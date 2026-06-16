import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'billing', label: 'Billing', icon: '🧾' },
    { id: 'items', label: 'Items', icon: '📋' },
    { id: 'files', label: 'Files', icon: '📁' }
  ];

  return (
    <div className="w-full md:w-64 bg-white/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-200/60 print:hidden flex flex-col md:h-full z-20 shrink-0">
      <div className="p-4 md:p-6 flex justify-between items-center md:block">
        <div>
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">Item Manager</h1>
          <p className="text-[10px] md:text-xs font-semibold text-slate-500 mt-0.5 md:mt-1 uppercase tracking-wider hidden md:block">Admin Panel</p>
        </div>
      </div>
      
      <nav className="md:mt-2 flex-none md:flex-1 flex flex-row md:flex-col gap-2 md:gap-1 px-4 md:px-3 pb-4 md:pb-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap flex-none md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] transform scale-[1.02]'
                : 'bg-slate-100 md:bg-transparent text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600'
            }`}
          >
            <span className="text-lg md:text-xl">{tab.icon}</span>
            <span className="font-medium text-sm md:text-base">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;