import React, { useState } from 'react';

const BillingTab = ({ items = [] }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPurchaseCode, setItemPurchaseCode] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [billNumber, setBillNumber] = useState(() => {
    return localStorage.getItem('lastBillNumber') || '1001';
  });

  const handleQuickAdd = (item) => {
    const price = parseFloat(item.price);
    const quantity = 1;

    if (isNaN(price) || price <= 0) {
      alert('Item has an invalid price.');
      return;
    }

    setBillItems(prevItems => [...prevItems, {
      id: Date.now().toString() + Math.random().toString(),
      name: item.name,
      purchaseCode: item.purchaseCode || '',
      price,
      quantity,
      subtotal: price * quantity
    }]);
  };

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
    if (billItems.length === 0 || window.confirm('Are you sure you want to clear the current bill and start a new one?')) {
      setCustomerName('');
      setCustomerPhone('');
      setBillItems([]);
      setDiscount('');
      
      const nextNum = (parseInt(billNumber, 10) || 1000) + 1;
      const nextNumStr = nextNum.toString();
      setBillNumber(nextNumStr);
      localStorage.setItem('lastBillNumber', nextNumStr);
    }
  };

  const printBill = () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill before printing.');
      return;
    }
    
    const originalTitle = document.title;
    document.title = `Bill_${billNumber}`;
    
    const handleAfterPrint = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    window.print();
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = parseFloat(discount) || 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const filteredItems = items.filter(item => 
    item.name?.toLowerCase().includes(itemSearchTerm.toLowerCase()) || 
    item.purchaseCode?.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  // Format date as dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-4 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column */}
      <div className="lg:col-span-4 space-y-4 print:hidden">
        
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Bill Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Bill No:</label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => {
                  setBillNumber(e.target.value);
                  localStorage.setItem('lastBillNumber', e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Discount (₹):</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
              />
            </div>
            {/* <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            /> */}
            {/* <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            /> */}
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
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="Price"
                step="0.01"
                min="0"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />             
            </div>
              <input
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                min="1"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold transition">
              Add to Bill
            </button>
          </form>
        </div>

        {/* Quick Add Items List */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col max-h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Available Items</h3>
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search items..."
              value={itemSearchTerm}
              onChange={(e) => setItemSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {filteredItems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No items found</p>
            ) : (
              filteredItems.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleQuickAdd(item)}
                  className="p-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center group"
                >
                  <div className="flex-1 mr-2">
                    <p className="font-medium text-slate-800 group-hover:text-indigo-700 break-words line-clamp-2 leading-tight">{item.name}</p>
                    {item.purchaseCode && <p className="text-xs text-slate-500 mt-0.5">{item.purchaseCode}</p>}
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <p className="font-semibold text-indigo-600">₹{parseFloat(item.price || 0).toFixed(2)}</p>
                    <span className="text-[10px] font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 bg-indigo-100 px-1.5 py-0.5 rounded">Add</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Invoice */}
      <div className="lg:col-span-8 bg-white rounded-xl shadow-md p-6 print:shadow-none print:p-1">
        
        {/* Print Container - Optimized for 3-inch thermal printer */}
        <div className="print-container">
          {/* Header */}
          <div className="border-b border-slate-200 pb-2 mb-2 print:border-b-2 print:border-black print:pb-1 print:mb-1">
            <div className="flex justify-between items-start print:flex-col print:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 print:text-sm print:font-extrabold print:text-center print:tracking-wide">
                  Estimate <span className="text-slate-500 font-medium text-base ml-2 print:text-xs print:font-bold">#{billNumber}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 print:text-[10px] print:font-bold print:text-center print:tracking-wide">
                  {formatDate(new Date())}
                </p>
              </div>
              <div className="text-right print:text-center print:w-full print:mt-1">
                <h1 className="text-xl font-bold text-indigo-600 print:text-sm print:font-extrabold print:text-black print:tracking-wider">Look Fancy</h1>
                <p className="text-xs text-gray-500 print:text-[10px] print:font-bold print:text-black">Moonupeedika Beach Road</p>
                <p className="text-xs text-gray-500 print:text-[10px] print:font-bold print:text-black">Phone: 7012479127</p>
              </div>
            </div>
            {/* <div className="mt-2 print:mt-1 print:border-t-2 print:border-black print:pt-1">
              <p className="text-xs font-semibold text-slate-400 mb-0.5 print:text-[10px] print:font-extrabold print:text-black print:tracking-wide">Billed To:</p>
              <p className="font-semibold print:text-xs print:font-extrabold print:tracking-wide">{customerName || 'Walk-in Customer'}</p>
              {customerPhone && <p className="text-sm text-gray-600 print:text-xs print:font-bold print:text-black">{customerPhone}</p>}
            </div> */}
          </div>

          {/* Items Table - Table header border removed */}
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-sm min-w-[500px] print:min-w-0 print:text-xs">
              <thead className="print:border-none">
                <tr className="text-gray-500 print:text-black print:font-extrabold">
                  <th className="py-0.5 text-left print:py-0.5 print:pl-0 print:text-[10px]">Item</th>
                  <th className="py-0.5 text-center w-12 print:w-8 print:py-0.5 print:text-[10px]">Qty</th>
                  <th className="py-0.5 text-right w-20 print:w-14 print:py-0.5 print:text-[10px]">Price</th>
                  <th className="py-0.5 text-right w-24 print:w-16 print:py-0.5 print:text-[10px]">Total</th>
                  <th className="py-0.5 w-8 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="print:divide-y-0">
                {billItems.length === 0 ? (
                  <tr><td colSpan="5" className="py-2 text-center text-gray-400 print:py-1 print:text-[10px] print:font-bold print:text-black">No items added</td></tr>
                ) : (
                  billItems.map((item) => (
                    <tr key={item.id} className="print:border-none">
                      <td className="py-0.5 print:py-0.5 print:pl-0">
                        <div className="font-medium print:text-[10px] print:font-extrabold print:tracking-wide break-words whitespace-normal">
                          {item.name}
                        </div>
                        {item.purchaseCode && (
                          <div className="text-xs text-gray-400 print:text-[9px] print:font-bold print:text-black">
                            ({item.purchaseCode})
                          </div>
                        )}
                      </td>
                      <td className="py-0.5 text-center print:py-0.5 print:text-[10px] print:font-bold">{item.quantity}</td>
                      <td className="py-0.5 text-right print:py-0.5 print:text-[10px] print:font-bold">₹{item.price.toFixed(2)}</td>
                      <td className="py-0.5 text-right font-semibold print:py-0.5 print:text-[10px] print:font-extrabold">₹{item.subtotal.toFixed(2)}</td>
                      <td className="py-0.5 text-right print:hidden">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">✕</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="border-t border-slate-200 pt-2 mt-2 print:border-t-4 print:border-black print:pt-1 print:mt-1">
            <div className="flex flex-col items-end gap-0.5 print:w-full">
              {discountAmount > 0 && (
                <>
                  <div className="flex justify-between w-full max-w-xs print:max-w-full">
                    <p className="text-sm text-gray-500 print:text-[10px] print:font-extrabold print:text-black">Subtotal</p>
                    <p className="text-sm font-medium text-slate-700 print:text-[10px] print:font-extrabold print:text-black">₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between w-full max-w-xs print:max-w-full">
                    <p className="text-sm text-rose-500 print:text-[10px] print:font-extrabold print:text-black">Discount</p>
                    <p className="text-sm font-medium text-rose-500 print:text-[10px] print:font-extrabold print:text-black">- ₹{discountAmount.toFixed(2)}</p>
                  </div>
                </>
              )}
              <div className="flex justify-between w-full max-w-xs print:max-w-full print:border-t-2 print:border-black print:pt-0.5 print:mt-0.5">
                <p className="text-sm text-gray-500 print:text-sm print:font-extrabold print:text-black print:tracking-wider">TOTAL</p>
                <p className="text-2xl font-bold text-indigo-600 print:text-base print:font-black print:text-black print:tracking-wider">₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>         
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
          <button onClick={clearBill} className="w-full sm:w-auto px-5 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
            Clear Bill
          </button>
          <button onClick={printBill} disabled={billItems.length === 0} className="w-full sm:w-auto px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50">
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto; /* 3-inch thermal paper */
            // margin: 1mm 1mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          .print-container {
            max-width: 72mm;
            margin: 0 auto;
            // padding: 0 0.5mm;
            font-family: 'Courier New', 'Courier', monospace;
          }
          
          /* Force all text to be black and bold in print */
          .print-container * {
            color: #000 !important;
            border-color: #000 !important;
          }
          
          /* Make all text bold for better visibility */
          .print-container {
            font-weight: bold !important;
          }
          
          .print-container h2,
          .print-container h1,
          .print-container p,
          .print-container td,
          .print-container th,
          .print-container div,
          .print-container span,
          .print-container strong {
            font-weight: bold !important;
          }
          
          /* Make headings extra bold */
          .print-container h1,
          .print-container h2,
          .print-container .font-extrabold,
          .print-container .font-black {
            font-weight: 900 !important;
          }
          
          /* COMPLETELY REMOVE ALL LINES BETWEEN ITEM ROWS */
          // .print-container tbody tr {
          //   border-bottom: none !important;
          // }
          
          /* Remove any other potential borders */
          .print-container tbody tr:not(:last-child) {
            border-bottom: none !important;
          }
          
          /* Remove any table row borders */
          .print-container table tbody tr {
            border: none !important;
          }
          
          /* Remove table header border */
          .print-container thead {
            border: none !important;
          }
          
          .print-container thead tr {
            border: none !important;
          }
          
          .print-container thead th {
            border: none !important;
          }
          
          /* Make borders thicker for sections only */
          .print-container .border-b {
            border-bottom-width: 2px !important;
          }
          
          .print-container .border-t {
            border-top-width: 2px !important;
          }
          
          /* Hide background colors in print */
          .print-container .bg-indigo-600 {
            background: transparent !important;
          }
          
          /* Reduce padding for compact printing */
          .print-container .py-0\\.5 {
            padding-top: 1px !important;
            padding-bottom: 1px !important;
          }
          
          /* Allow long item names to wrap */
          .print-container .break-words {
            word-break: break-word !important;
          }
          
          .print-container .whitespace-normal {
            white-space: normal !important;
          }
        }
        
        /* Screen styles for the print container */
        .print-container {
          max-width: 100%;
        }
        
        @media screen and (max-width: 640px) {
          .print-container {
            padding: 0 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default BillingTab;