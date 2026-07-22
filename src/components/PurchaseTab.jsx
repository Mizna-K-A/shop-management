import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';

const PurchaseTab = () => {
  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_purchases');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [supplier, setSupplier] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [amount, setAmount] = useState('');

  const [filterType, setFilterType] = useState('all'); // all, daily, weekly, monthly, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    localStorage.setItem('shop_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const handleAddPurchase = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!supplier.trim() || !itemDesc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all fields correctly',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    const newPurchase = {
      id: Date.now(),
      supplier: supplier.trim(),
      itemDesc: itemDesc.trim(),
      amount: parsedAmount,
      date: new Date().toISOString()
    };

    setPurchases([newPurchase, ...purchases]);
    setSupplier('');
    setItemDesc('');
    setAmount('');

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Purchase record added successfully',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this purchase record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPurchases(purchases.filter(p => p.id !== id));
      }
    });
  };

  const filteredPurchases = useMemo(() => {
    if (filterType === 'all') return purchases;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return purchases.filter(p => {
      const pDate = new Date(p.date);
      const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate());

      if (filterType === 'daily') {
        return pDay.getTime() === today.getTime();
      }

      if (filterType === 'weekly') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return pDay >= lastWeek && pDay <= today;
      }

      if (filterType === 'monthly') {
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      }

      if (filterType === 'custom') {
        if (!startDate || !endDate) return true;
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return pDate >= start && pDate <= end;
      }

      return true;
    });
  }, [purchases, filterType, startDate, endDate]);

  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `purchase_backup_${timestamp}.json`;
      
      const backupData = {
        exportedAt: new Date().toISOString(),
        purchases: purchases,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backupFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: `Purchases exported to ${backupFileName}`,
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error exporting purchases',
        confirmButtonColor: '#4f46e5'
      });
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.purchases && Array.isArray(data.purchases)) {
          const existingIds = new Set(purchases.map(p => p.id));
          const newPurchases = data.purchases.filter(p => !existingIds.has(p.id));
          
          setPurchases(prev => [...prev, ...newPurchases]);
          
          Swal.fire({
            icon: 'success',
            title: 'Imported',
            text: `Imported ${newPurchases.length} new purchase records.`,
            confirmButtonColor: '#10b981'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Format',
            text: 'Invalid purchase backup file format',
            confirmButtonColor: '#4f46e5'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error importing purchases',
          confirmButtonColor: '#4f46e5'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Left side: Add Purchase Form */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 tracking-tight">Add Purchase</h2>
        <form onSubmit={handleAddPurchase} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 border border-slate-100">
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Supplier Name</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="Enter supplier name"
            />
          </div>
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Item Description</label>
            <input
              type="text"
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="What did you buy?"
            />
          </div>
          <div className="mb-8">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all focus:bg-white"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="w-full bg-green-800 text-white py-3.5 rounded-xl hover:bg-green-700 transition-all font-bold">
            Add Purchase
          </button>
        </form>
      </div>

      {/* Right side: Purchase List and Filters */}
      <div className="lg:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Purchase History</h2>
            <div className="flex gap-2 ml-2">
              <button
                onClick={handleExport}
                disabled={purchases.length === 0}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                Export
              </button>
              <label className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'daily', 'weekly', 'monthly', 'custom'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filterType === type ? 'bg-green-600 text-green-800' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filterType === 'custom' && (
          <div className="mb-6 flex gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] p-4 border border-slate-100 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg text-sm">🛒</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Records</div>
              <div className="font-bold text-lg text-slate-800">{filteredPurchases.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 text-red-600 p-1.5 rounded-lg text-sm">💸</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Spent</div>
              <div className="font-bold text-lg text-red-600">₹{totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] overflow-x-auto border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No purchase records found.</td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-500 text-xs font-medium">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{p.supplier}</td>
                    <td className="px-4 py-2.5 text-slate-600 text-sm">{p.itemDesc}</td>
                    <td className="px-4 py-2.5 font-bold text-red-600 text-sm">₹{p.amount.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTab;
