import React from 'react';

const DashboardTab = ({ items }) => {
  const totalItems = items.length;
  const totalPieces = items.reduce((sum, item) => sum + item.pieces, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.pieces), 0);
  const averagePrice = totalPieces > 0 ? totalValue / totalPieces : 0;
  
  const stats = [
    { label: 'Current Items', value: totalItems, icon: '📦', color: 'bg-blue-500' },
    { label: 'Total Pieces', value: totalPieces, icon: '🔢', color: 'bg-green-500' },
    { label: 'Total Value', value: `₹${totalValue.toFixed(2)}`, icon: '💰', color: 'bg-purple-500' },
    { label: 'Average Price', value: `₹${averagePrice.toFixed(2)}`, icon: '📊', color: 'bg-orange-500' },
  ];

  const recentItems = [...items].reverse().slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 md:mb-8 tracking-tight">Dashboard</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color.replace('500', '100')} text-${stat.color.split('-')[1]}-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center shadow-sm`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</span>
              </div>
              <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Recent Items */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Items</h3>
          
          {recentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added yet. Start by adding items from the "Add Item" tab.
            </div>
          ) : (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        <span className="inline-block bg-slate-100 rounded-md px-2 py-0.5 text-xs font-medium mr-2">{item.pieces} pieces</span>
                        × ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600 text-lg">₹{item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;