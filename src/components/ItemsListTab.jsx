import React, { useState } from 'react';

const ItemsListTab = ({ items, onDeleteItem, onUpdateItem }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPurchaseCode, setEditPurchaseCode] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPieces, setEditPieces] = useState('');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPurchaseCode(item.purchaseCode || '');
    setEditPrice(item.price.toString());
    setEditPieces(item.pieces.toString());
  };

  const saveEdit = (id) => {
    const price = parseFloat(editPrice);
    const pieces = parseInt(editPieces);
    
    if (!editName.trim() || isNaN(price) || price <= 0 || isNaN(pieces) || pieces < 1) {
      alert('Invalid input');
      return;
    }
    
    onUpdateItem(id, {
      name: editName.trim(),
      purchaseCode: editPurchaseCode.trim(),
      price: price,
      pieces: pieces
    });
    
    setEditingId(null);
  };

  const totalValue = items.reduce((sum, item) => sum + (item.price * item.pieces), 0);

  if (items.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Yet</h3>
          <p className="text-gray-500">Add items from the "Add Item" tab</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6 tracking-tight">Items List</h2>
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">📦</div>
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Items</div>
              <div className="font-black text-2xl text-slate-800">{items.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">💰</div>
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Value</div>
              <div className="font-black text-2xl text-emerald-600">₹{totalValue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-x-auto border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pieces
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Price/Piece
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editPurchaseCode}
                        onChange={(e) => setEditPurchaseCode(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editPieces}
                        onChange={(e) => setEditPieces(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4">
                      ₹{(parseFloat(editPrice) * parseInt(editPieces)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {item.purchaseCode ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">{item.purchaseCode}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-sm font-semibold">{item.pieces}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      ₹{item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm font-medium">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsListTab;