import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'billing', label: 'Billing', icon: '🧾' },
    { id: 'items', label: 'Items', icon: '📋' },
    { id: 'files', label: 'Files', icon: '📁' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg print:hidden">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Item Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
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