import React from 'react';

const DashboardTab = ({ items, currentFileIndex, fileItemsCount }) => {
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
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        {/* File Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90">Current Working File</div>
              <div className="text-3xl font-bold">f{currentFileIndex}</div>
              <div className="text-sm mt-2">
                {fileItemsCount}/100 items used
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Storage Status</div>
              <div className="text-2xl font-bold">{100 - fileItemsCount} slots left</div>
            </div>
          </div>
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${(fileItemsCount / 100) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} text-white rounded-full p-2 w-10 h-10 flex items-center justify-center`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Items</h3>
          
          {recentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added yet. Start by adding items from the "Add Item" tab.
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div key={item.id} className="border-b last:border-0 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.pieces} pieces × ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">{item.date}</div>
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