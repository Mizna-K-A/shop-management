import React, { useState } from 'react';

const ItemsListTab = ({ items, onDeleteItem, onUpdateItem }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPieces, setEditPieces] = useState('');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Items List</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold text-lg">{items.length}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Total Value:</span>
            <span className="font-semibold text-lg text-green-600">₹{totalValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pieces
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Piece
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.pieces}</td>
                    <td className="px-6 py-4 text-gray-600">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
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