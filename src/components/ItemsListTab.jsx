import React, { useState } from 'react';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please enter valid details for the item.',
        confirmButtonColor: '#4f46e5'
      });
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
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No Items Yet</h3>
          <p className="text-sm text-gray-500">Add items from the "Add Item" tab</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Items List</h2>
        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] p-4 border border-slate-100 flex flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg text-sm">📦</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Items</div>
              <div className="font-bold text-lg text-slate-800">{items.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg text-sm">💰</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Value</div>
              <div className="font-bold text-lg text-emerald-600">₹{totalValue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] overflow-x-auto border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Pieces
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                {editingId === item.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editPurchaseCode}
                        onChange={(e) => setEditPurchaseCode(e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editPieces}
                        onChange={(e) => setEditPieces(e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold">
                      ₹{(parseFloat(editPrice) * parseInt(editPieces)).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm">{item.date}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-semibold mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-medium text-sm">
                      {item.purchaseCode ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] border border-slate-200">{item.purchaseCode}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{item.pieces}</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-medium text-sm">₹{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 text-sm">
                      ₹{item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs font-medium">{item.date}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-green-700 hover:text-green-900 font-semibold text-sm mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
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