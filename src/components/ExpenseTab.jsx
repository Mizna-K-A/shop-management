import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';

const CATEGORIES = [
  'Rent', 'Electricity', 'Salary', 'Transport', 'Maintenance',
  'Marketing', 'Packaging', 'Miscellaneous'
];

const ExpenseTab = () => {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Miscellaneous');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Miscellaneous');
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    localStorage.setItem('shop_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all required fields correctly',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      category,
      amount: parsedAmount,
      note: note.trim(),
      date: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setCategory('Miscellaneous');
    setAmount('');
    setNote('');

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Expense record added successfully',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this expense record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setExpenses(expenses.filter(ex => ex.id !== id));
      }
    });
  };

  const startEdit = (ex) => {
    setEditingId(ex.id);
    setEditTitle(ex.title);
    setEditCategory(ex.category);
    setEditAmount(ex.amount.toString());
    setEditNote(ex.note || '');
  };

  const saveEdit = (id) => {
    const parsedAmount = parseFloat(editAmount);
    if (!editTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Please fill all required fields correctly', confirmButtonColor: '#4f46e5' });
      return;
    }
    setExpenses(prev => prev.map(ex =>
      ex.id === id ? { ...ex, title: editTitle.trim(), category: editCategory, amount: parsedAmount, note: editNote.trim() } : ex
    ));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Date filter
    if (filterType !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter(ex => {
        const exDate = new Date(ex.date);
        const exDay = new Date(exDate.getFullYear(), exDate.getMonth(), exDate.getDate());

        if (filterType === 'daily') return exDay.getTime() === today.getTime();

        if (filterType === 'weekly') {
          const lastWeek = new Date(today);
          lastWeek.setDate(lastWeek.getDate() - 7);
          return exDay >= lastWeek && exDay <= today;
        }

        if (filterType === 'monthly') {
          return exDate.getMonth() === now.getMonth() && exDate.getFullYear() === now.getFullYear();
        }

        if (filterType === 'custom') {
          if (!startDate || !endDate) return true;
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return exDate >= start && exDate <= end;
        }

        return true;
      });
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(ex =>
        ex.title.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        (ex.note && ex.note.toLowerCase().includes(q))
      );
    }

    // Alphabetical order by title
    result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [expenses, filterType, startDate, endDate, search]);

  const totalAmount = filteredExpenses.reduce((sum, ex) => sum + ex.amount, 0);

  const handleExport = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `expense_backup_${timestamp}.json`;
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), expenses }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({ icon: 'success', title: 'Export Successful', text: `Expenses exported to ${fileName}`, confirmButtonColor: '#10b981' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error exporting expenses', confirmButtonColor: '#4f46e5' });
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.expenses && Array.isArray(data.expenses)) {
          const existingIds = new Set(expenses.map(ex => ex.id));
          const newExpenses = data.expenses.filter(ex => !existingIds.has(ex.id));
          setExpenses(prev => [...prev, ...newExpenses]);
          Swal.fire({ icon: 'success', title: 'Imported', text: `Imported ${newExpenses.length} new expense records.`, confirmButtonColor: '#10b981' });
        } else {
          Swal.fire({ icon: 'error', title: 'Invalid Format', text: 'Invalid expense backup file format', confirmButtonColor: '#4f46e5' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error importing expenses', confirmButtonColor: '#4f46e5' });
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  const categoryColors = {
    Rent: 'bg-purple-100 text-purple-700',
    Electricity: 'bg-yellow-100 text-yellow-700',
    Salary: 'bg-blue-100 text-blue-700',
    Transport: 'bg-orange-100 text-orange-700',
    Maintenance: 'bg-gray-100 text-gray-700',
    Marketing: 'bg-pink-100 text-pink-700',
    Packaging: 'bg-teal-100 text-teal-700',
    Miscellaneous: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Left: Add Expense Form */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 tracking-tight">Add Expense</h2>
        <form onSubmit={handleAddExpense} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 border border-slate-100">
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Expense Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all focus:bg-white"
              placeholder="e.g. Monthly Rent"
            />
          </div>
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all focus:bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Amount (₹) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all focus:bg-white"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-8">
            <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wide">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all focus:bg-white resize-none"
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3.5 rounded-xl hover:bg-orange-500 transition-all font-bold"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Right: Expense List */}
      <div className="lg:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Expense History</h2>
            <div className="flex gap-2 ml-2">
              <button
                onClick={handleExport}
                disabled={expenses.length === 0}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                Export
              </button>
              <label className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'daily', 'weekly', 'monthly', 'custom'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filterType === type ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
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
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, category or note..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] p-4 border border-slate-100 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg text-sm">🧾</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Records</div>
              <div className="font-bold text-lg text-slate-800">{filteredExpenses.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg text-sm">💸</div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Spent</div>
              <div className="font-bold text-lg text-orange-600">₹{totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.04)] overflow-x-auto border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Note</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    {search ? 'No expenses match your search.' : 'No expense records found.'}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(ex => (
                  <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                    {editingId === ex.id ? (
                      <>
                        <td className="px-4 py-2 text-slate-500 text-xs font-medium">{new Date(ex.date).toLocaleDateString()}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                          >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editNote}
                            onChange={e => setEditNote(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                            placeholder="Note..."
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={e => setEditAmount(e.target.value)}
                            className="w-24 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button onClick={() => saveEdit(ex.id)} className="text-green-600 hover:text-green-800 font-semibold text-sm mr-2 transition-colors">Save</button>
                          <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 text-slate-500 text-xs font-medium">{new Date(ex.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{ex.title}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryColors[ex.category] || 'bg-slate-100 text-slate-600'}`}>
                            {ex.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{ex.note || <span className="text-slate-300">—</span>}</td>
                        <td className="px-4 py-2.5 font-bold text-orange-600 text-sm">₹{ex.amount.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right whitespace-nowrap">
                          <button onClick={() => startEdit(ex)} className="text-green-700 hover:text-green-900 font-semibold text-sm mr-3 transition-colors">Edit</button>
                          <button onClick={() => handleDelete(ex.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors">Delete</button>
                        </td>
                      </>
                    )}
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

export default ExpenseTab;
