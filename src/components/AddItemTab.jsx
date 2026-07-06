import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddItemTab = ({ onAddItem, loading }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [purchaseCode, setPurchaseCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const price = parseFloat(itemPrice);
    
    if (!itemName.trim() || isNaN(price) || price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all fields correctly',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }
    
    onAddItem({
      name: itemName.trim(),
      price: price,
      purchaseCode: purchaseCode.trim(),
      pieces: 1
    });
    
    setItemName('');
    setItemPrice('');
    setPurchaseCode('');
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 md:mb-8 tracking-tight">Add New Item</h2>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 border border-slate-100">
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="Enter item name"
              disabled={loading}
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">
              Purchase Code
            </label>
            <input
              type="text"
              value={purchaseCode}
              onChange={(e) => setPurchaseCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="Enter purchase code"
              disabled={loading}
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">
              Price per Piece (₹)
            </label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3.5 rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
        
        <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6">
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span> Quick Tips
          </h3>
          <ul className="text-sm text-green-800/80 space-y-2">
            <li className="flex items-center gap-2"><span>•</span> Items will be automatically saved when reaching 100 items</li>
            <li className="flex items-center gap-2"><span>•</span> Each file can hold up to 100 items</li>
            <li className="flex items-center gap-2"><span>•</span> You can manually save items from the Files tab</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddItemTab;