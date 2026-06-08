import React, { useState } from 'react';

const AddItemTab = ({ onAddItem, loading }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const price = parseFloat(itemPrice);
    
    if (!itemName.trim() || isNaN(price) || price <= 0) {
      alert('Please fill all fields correctly');
      return;
    }
    
    onAddItem({
      name: itemName.trim(),
      price: price,
      pieces: 1
    });
    
    setItemName('');
    setItemPrice('');
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Item</h2>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
              disabled={loading}
            />
          </div>
          

          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Price per Piece (₹)
            </label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price per piece"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Items will be automatically saved when reaching 100 items</li>
            <li>• Each file can hold up to 100 items</li>
            <li>• You can manually save items from the Files tab</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddItemTab;