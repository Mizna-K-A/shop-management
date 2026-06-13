import React, { useState } from 'react';

const BillingTab = ({ items = [] }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPurchaseCode, setItemPurchaseCode] = useState('');
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
    
    setBillItems([...billItems, {
      id: Date.now(),
      name: itemName.trim(),
      purchaseCode: itemPurchaseCode.trim(),
      price,
      quantity,
      subtotal: price * quantity
    }]);
    
    setItemName('');
    setItemPurchaseCode('');
    setItemPrice('');
    setItemQuantity('1');
  };

  const removeItem = (id) => setBillItems(billItems.filter(item => item.id !== id));
  
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
    <div className="p-4 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column */}
      <div className="lg:col-span-4 space-y-4 print:hidden">
        
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Customer Details</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Add Item</h3>
          <form onSubmit={handleAddItem} className="space-y-3">
            <input
              type="text"
              list="inventory-items"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                const selectedItem = items.find(i => i.name === e.target.value);
                if (selectedItem) {
                  setItemPrice(selectedItem.price.toString());
                  if (selectedItem.purchaseCode) setItemPurchaseCode(selectedItem.purchaseCode);
                }
              }}
              placeholder="Item name"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <datalist id="inventory-items">
              {items.map((item, idx) => <option key={idx} value={item.name} />)}
            </datalist>
            <input
              type="text"
              value={itemPurchaseCode}
              onChange={(e) => setItemPurchaseCode(e.target.value)}
              placeholder="Purchase code (optional)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="Price"
                step="0.01"
                min="0"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                min="1"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold transition">
              Add to Bill
            </button>
          </form>
        </div>
      </div>

      {/* Right Column - Invoice */}
      <div className="lg:col-span-8 bg-white rounded-xl shadow-md p-6 print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">INVOICE</h2>
              <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-indigo-600">My Shop</h1>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400 mb-1">Billed To:</p>
            <p className="font-semibold">{customerName || 'Walk-in Customer'}</p>
            {customerPhone && <p className="text-sm text-gray-600">{customerPhone}</p>}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-gray-500">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-center w-16">Qty</th>
              <th className="py-2 text-right w-24">Price</th>
              <th className="py-2 text-right w-24">Total</th>
              <th className="py-2 w-8 print:hidden"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {billItems.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-gray-400">No items added</td></tr>
            ) : (
              billItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <div className="font-medium">{item.name}</div>
                    {item.purchaseCode && <div className="text-xs text-gray-400">{item.purchaseCode}</div>}
                  </td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">₹{item.subtotal.toFixed(2)}</td>
                  <td className="py-3 text-right print:hidden">
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">✕</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Due</p>
              <p className="text-2xl font-bold text-indigo-600">₹{grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 print:hidden">
          <button onClick={clearBill} className="px-5 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
            Clear
          </button>
          <button onClick={printBill} disabled={billItems.length === 0} className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;