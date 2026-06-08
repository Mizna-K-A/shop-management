import React, { useState } from 'react';

const BillingTab = ({ items = [] }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [billItems, setBillItems] = useState([]);
  
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');

  const handleAddItem = (e) => {
    e.preventDefault();
    
    const price = parseFloat(itemPrice);
    const quantity = parseInt(itemQuantity);
    
    if (!itemName.trim() || isNaN(price) || price <= 0 || isNaN(quantity) || quantity < 1) {
      alert('Please enter valid item details.');
      return;
    }
    
    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      price: price,
      quantity: quantity,
      subtotal: price * quantity
    };
    
    setBillItems([...billItems, newItem]);
    
    // Reset form
    setItemName('');
    setItemPrice('');
    setItemQuantity('1');
  };

  const removeItem = (id) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const clearBill = () => {
    if (window.confirm('Are you sure you want to clear the current bill?')) {
      setCustomerName('');
      setCustomerPhone('');
      setBillItems([]);
    }
  };

  const printBill = () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill before printing.');
      return;
    }
    window.print();
  };

  const grandTotal = billItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Form Controls (hidden during print) */}
      <div className="lg:col-span-4 space-y-6 print:hidden">
        
        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Add Item</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                list="inventory-items"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  const selectedItem = items.find(i => i.name === e.target.value);
                  if (selectedItem) {
                    setItemPrice(selectedItem.price.toString());
                  }
                }}
                placeholder="Select or type item name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="inventory-items">
                {items.map((item, idx) => (
                  <option key={idx} value={item.name}>Price: ₹{item.price}</option>
                ))}
              </datalist>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Add to Bill
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Invoice Preview (Printed) */}
      <div className="lg:col-span-8 bg-white rounded-lg shadow-md p-8 print:col-span-12 print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="border-b-2 border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-sm text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-blue-600">My Shop</h1>
              <p className="text-sm text-gray-500 mt-1">Thank you for your business.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Billed To:</h3>
            {customerName || customerPhone ? (
              <div className="text-gray-800">
                <p className="font-semibold text-lg">{customerName || 'Walk-in Customer'}</p>
                {customerPhone && <p>{customerPhone}</p>}
              </div>
            ) : (
              <p className="text-gray-400 italic">Customer details not provided</p>
            )}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="py-3 font-semibold w-1/2">Item Description</th>
                <th className="py-3 font-semibold text-center w-1/6">Price</th>
                <th className="py-3 font-semibold text-center w-1/6">Qty</th>
                <th className="py-3 font-semibold text-right w-1/6">Amount</th>
                <th className="py-3 w-10 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {billItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 italic">
                    No items added to the bill yet.
                  </td>
                </tr>
              ) : (
                billItems.map((item) => (
                  <tr key={item.id} className="text-gray-800">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td className="py-4 text-center">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right font-semibold">₹{item.subtotal.toFixed(2)}</td>
                    <td className="py-4 text-right print:hidden">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Totals */}
        <div className="border-t-2 border-gray-200 pt-6 mt-6">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-xl font-bold text-gray-800 border-b border-gray-300">
                <span>Total Due:</span>
                <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions (hidden during print) */}
        <div className="mt-12 flex justify-end gap-4 print:hidden border-t border-gray-100 pt-6">
          <button
            onClick={clearBill}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Clear Bill
          </button>
          <button
            onClick={printBill}
            disabled={billItems.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            🖨️ Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default BillingTab;
