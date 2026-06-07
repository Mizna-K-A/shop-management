import React, { useState, useEffect } from 'react';

const styles = `
  .im-app { padding: 1.5rem 0; max-width: 680px; font-family: sans-serif; margin-left:500px; }
  .im-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
  .im-header-icon { width: 36px; height: 36px; background: #f5f5f5; border: 0.5px solid #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #000000; }
  .im-title { font-size: 18px; font-weight: 500; color: #000000; margin: 0; }
  .im-subtitle { font-size: 13px; color: #000000; margin-top: 1px; }
  .im-add-card { background: #fff; border: 0.5px solid #e0e0e0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
  .im-add-label { font-size: 12px; color: #000000; letter-spacing: 0.04em; display: block; margin-bottom: 8px; }
  .im-input-row { display: flex; gap: 8px; }
  .im-input-row input { flex: 1; padding: 8px 10px; border: 0.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; color: #000000; background: #fff; outline: none; }
  .im-input-row input:focus { border-color: #111; box-shadow: 0 0 0 2px rgba(0,0,0,0.06); }
  .im-input-row input.price-input { flex: 0 0 130px; }
  .im-input-row input.pieces-input { flex: 0 0 100px; }
  .im-add-btn { display: flex; align-items: center; gap: 6px; padding: 0 16px; background: #fff; border: 0.5px solid #ccc; border-radius: 8px; font-size: 14px; color: #000000; cursor: pointer; white-space: nowrap; transition: background 0.1s; }
  .im-add-btn:hover { background: #f5f5f5; }
  .im-stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 1rem; }
  .im-stat { background: #f5f5f5; border-radius: 8px; padding: 12px 14px; }
  .im-stat-label { font-size: 12px; color: #000000; margin-bottom: 4px; }
  .im-stat-value { font-size: 20px; font-weight: 500; color: #000000; }
  .im-stat-value.green { color: #000000; }
  .im-list-card { background: #fff; border: 0.5px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
  .im-list-header { display: grid; grid-template-columns: 1fr 80px 100px 100px; padding: 10px 16px; border-bottom: 0.5px solid #e0e0e0; background: #f9f9f9; }
  .im-list-header span { font-size: 11px; color: #000000; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 500; }
  .im-list-header span:nth-child(2),
  .im-list-header span:nth-child(3),
  .im-list-header span:nth-child(4) { text-align: right; }
  .im-item-row { display: grid; grid-template-columns: 1fr 80px 100px 100px; align-items: center; padding: 12px 16px; border-bottom: 0.5px solid #f0f0f0; transition: background 0.1s; }
  .im-item-row:last-child { border-bottom: none; }
  .im-item-row:hover { background: #fafafa; }
  .im-item-row.editing { background: #fafafa; grid-template-columns: 1fr; }
  .im-item-name { font-size: 14px; color: #000000; }
  .im-item-date { font-size: 11px; color: #000000; margin-top: 2px; }
  .im-item-pieces { font-size: 14px; color: #000000; text-align: right; }
  .im-item-price { font-size: 14px; font-weight: 500; color: #000000; text-align: right; }
  .im-item-actions { display: flex; justify-content: flex-end; gap: 4px; }
  .im-icon-btn { width: 28px; height: 28px; border: 0.5px solid #e0e0e0; border-radius: 8px; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #000000; transition: background 0.1s, border-color 0.1s, color 0.1s; }
  .im-icon-btn:hover { background: #f5f5f5; border-color: #ccc; color: #000000; }
  .im-icon-btn.danger:hover { background: #fdecea; border-color: #f5c6c6; color: #c62828; }
  .im-edit-inputs { display: flex; gap: 6px; align-items: center; width: 100%; }
  .im-edit-inputs input { padding: 7px 10px; border: 0.5px solid #ddd; border-radius: 8px; font-size: 13px; color: #000000; background: #fff; outline: none; }
  .im-edit-inputs input:first-child { flex: 1; }
  .im-edit-inputs input:nth-child(2) { flex: 0 0 100px; }
  .im-edit-inputs input:nth-child(3) { flex: 0 0 100px; }
  .im-edit-inputs input:focus { border-color: #aaa; }
  .im-save-btn { padding: 0 12px; height: 34px; background: #fff; border: 0.5px solid #ccc; border-radius: 8px; font-size: 13px; cursor: pointer; color: #000000; white-space: nowrap; transition: background 0.1s; }
  .im-save-btn:hover { background: #f5f5f5; }
  .im-save-btn.muted { color: #000000; }
  .im-empty-state { padding: 3rem 1rem; text-align: center; }
  .im-empty-icon { font-size: 28px; color: #000000; margin-bottom: 12px; }
  .im-empty-title { font-size: 15px; color: #000000; margin-bottom: 4px; }
  .im-empty-sub { font-size: 13px; color: #000000; }
  .im-offline-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #000000; margin-top: 1rem; padding: 6px 12px; background: #f5f5f5; border: 0.5px solid #e0e0e0; border-radius: 999px; }
  .im-dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf50; }
  .im-reset-btn { background: #fff; border: 0.5px solid #ccc; border-radius: 8px; font-size: 14px; color: #000000; cursor: pointer; padding: 8px 16px; transition: background 0.1s; margin-left: 8px; }
  .im-reset-btn:hover { background: #f5f5f5; }
  .im-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1rem; gap: 10px; flex-wrap: wrap; }
  .im-print-btn, .im-export-btn, .im-import-btn, .im-save-file-btn { background: #fff; border: 0.5px solid #ccc; border-radius: 8px; font-size: 14px; color: #000000; cursor: pointer; padding: 8px 16px; transition: background 0.1s; }
  .im-print-btn:hover, .im-export-btn:hover, .im-import-btn:hover, .im-save-file-btn:hover { background: #f5f5f5; }
  .im-button-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .im-file-input { display: none; }
  .im-file-info { font-size: 12px; color: #000000; background: #f5f5f5; padding: 4px 8px; border-radius: 6px; }
`;

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemPieces, setItemPieces] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPieces, setEditPieces] = useState('');
  const [currentFileIndex, setCurrentFileIndex] = useState(1);
  const [fileItemsCount, setFileItemsCount] = useState(0);

  useEffect(() => {
    try {
      // Load current items from localStorage
      const saved = localStorage.getItem('crudItems');
      if (saved) setItems(JSON.parse(saved));
      
      // Load file tracking info
      const savedFileIndex = localStorage.getItem('currentFileIndex');
      const savedFileCount = localStorage.getItem('fileItemsCount');
      if (savedFileIndex) setCurrentFileIndex(parseInt(savedFileIndex));
      if (savedFileCount) setFileItemsCount(parseInt(savedFileCount));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('crudItems', JSON.stringify(items));
      localStorage.setItem('currentFileIndex', currentFileIndex);
      localStorage.setItem('fileItemsCount', fileItemsCount);
    } catch (e) {}
  }, [items, currentFileIndex, fileItemsCount]);

  const saveCurrentItemsToFile = () => {
    if (items.length === 0) {
      alert('No items to save!');
      return;
    }

    const data = {
      fileNumber: currentFileIndex,
      fileName: `f${currentFileIndex}`,
      items: items,
      totalItems: items.length,
      totalValue: items.reduce((s, i) => s + (i.price * i.pieces), 0),
      createdDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f${currentFileIndex}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  };

  const addItem = () => {
    const price = parseFloat(itemPrice);
    const pieces = parseInt(itemPieces);
    if (!itemName.trim() || isNaN(price) || price < 0 || isNaN(pieces) || pieces < 1) return;
    
    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      price: price,
      pieces: pieces,
      totalPrice: price * pieces,
      date: new Date().toLocaleDateString()
    };
    
    const newItems = [...items, newItem];
    const newCount = fileItemsCount + 1;
    
    // Check if we need to create a new file (every 100 items)
    if (newCount >= 100) {
      // Save current items to file
      const data = {
        fileNumber: currentFileIndex,
        fileName: `f${currentFileIndex}`,
        items: newItems,
        totalItems: newItems.length,
        totalValue: newItems.reduce((s, i) => s + (i.price * i.pieces), 0),
        createdDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `f${currentFileIndex}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Reset for new file
      setItems([]);
      setFileItemsCount(0);
      setCurrentFileIndex(currentFileIndex + 1);
      
      alert(`File f${currentFileIndex} saved with ${newItems.length} items! Starting new file f${currentFileIndex + 1}`);
    } else {
      // Just add to current items
      setItems(newItems);
      setFileItemsCount(newCount);
    }
    
    setItemName('');
    setItemPrice('');
    setItemPieces('');
  };

  const manualSaveToFile = () => {
    if (items.length === 0) {
      alert('No items to save!');
      return;
    }
    
    saveCurrentItemsToFile();
    alert(`Items saved to file f${currentFileIndex}.json`);
  };

  const deleteItem = (id) => {
    if (!window.confirm('Delete this item?')) return;
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    setFileItemsCount(fileItemsCount - 1);
  };

  const resetAllItems = () => {
    if (!window.confirm('Are you sure you want to reset all items? This action cannot be undone.')) return;
    setItems([]);
    setFileItemsCount(0);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toFixed(2));
    setEditPieces(item.pieces.toString());
  };

  const saveEdit = (id) => {
    const price = parseFloat(editPrice);
    const pieces = parseInt(editPieces);
    if (!editName.trim() || isNaN(price) || isNaN(pieces) || pieces < 1) return;
    setItems(items.map(i => i.id === id ? { 
      ...i, 
      name: editName.trim(), 
      price: price,
      pieces: pieces,
      totalPrice: price * pieces
    } : i));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // Print function for thermal printer
  const printReceipt = () => {
    if (items.length === 0) {
      alert('No items to print');
      return;
    }

    const total = items.reduce((s, i) => s + (i.price * i.pieces), 0);
    const now = new Date();
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0;
            padding: 10px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .shop-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .receipt-title {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .items {
            width: 100%;
            margin-bottom: 15px;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .item-name {
            flex: 1;
          }
          .item-details {
            text-align: right;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            border-top: 1px dashed #000;
            padding-top: 10px;
            font-size: 10px;
          }
          .date {
            text-align: center;
            font-size: 10px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="shop-name">ITEM MANAGER</div>
          <div class="receipt-title">Sales Receipt</div>
        </div>
        <div class="date">
          ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
        </div>
        <div class="items">
          ${items.map(item => `
            <div class="item-row">
              <span class="item-name">${item.name} (x${item.pieces})</span>
              <span class="item-details">₹${(item.price * item.pieces).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div class="divider"></div>
        <div class="total-row">
          <span>TOTAL:</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
        <div class="divider"></div>
        <div class="footer">
          Thank you for your business!<br/>
          File: f${currentFileIndex} (${fileItemsCount}/100 items)
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  const exportToFile = () => {
    const data = {
      items,
      currentFileIndex,
      fileItemsCount,
      exportDate: new Date().toISOString(),
      totalItems: items.length,
      totalValue: items.reduce((s, i) => s + (i.price * i.pieces), 0)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `items_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.items && Array.isArray(data.items)) {
          if (window.confirm(`Import ${data.items.length} items? This will replace your current items.`)) {
            setItems(data.items);
            if (data.currentFileIndex) setCurrentFileIndex(data.currentFileIndex);
            if (data.fileItemsCount) setFileItemsCount(data.fileItemsCount);
          }
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const total = items.reduce((s, i) => s + (i.price * i.pieces), 0);
  const totalPieces = items.reduce((s, i) => s + i.pieces, 0);
  const itemsRemaining = 100 - fileItemsCount;

  return (
    <>
      <style>{styles}</style>
      <div className="im-app">

        {/* Header */}
        <div className="im-header">
          <div className="im-header-icon">🛒</div>
          <div>
            <div className="im-title">Item manager</div>
            <div className="im-subtitle">Track your items and prices</div>
          </div>
        </div>

        {/* File Info Bar */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="im-file-info">📁 Current File: f{currentFileIndex}</span>
          <span className="im-file-info">📊 Items in file: {fileItemsCount}/100</span>
          <span className="im-file-info">⏳ {itemsRemaining} items until next file</span>
          <button className="im-save-file-btn" onClick={manualSaveToFile}>
            💾 Save to f{currentFileIndex}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          marginBottom: '1rem', 
          background: '#f0f0f0', 
          borderRadius: '10px',
          overflow: 'hidden',
          height: '8px'
        }}>
          <div style={{ 
            width: `${(fileItemsCount / 100) * 100}%`, 
            background: '#4caf50', 
            height: '100%',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Add Item */}
        <div className="im-add-card">
          <label className="im-add-label">Add new item</label>
          <div className="im-input-row">
            <input
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('pieces-input').focus()}
            />
            <input
              id="pieces-input"
              type="number"
              placeholder="Pieces"
              className="pieces-input"
              value={itemPieces}
              onChange={e => setItemPieces(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('price-input').focus()}
              min="1"
              step="1"
            />
            <input
              id="price-input"
              type="number"
              placeholder="Price per piece"
              className="price-input"
              value={itemPrice}
              onChange={e => setItemPrice(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              step="0.01"
              min="0"
            />
            <button className="im-add-btn" onClick={addItem}>+ Add</button>
          </div>
        </div>

        {/* Stats */}
        <div className="im-stats-row">
          <div className="im-stat">
            <div className="im-stat-label">Current items</div>
            <div className="im-stat-value">{items.length}</div>
          </div>
          <div className="im-stat">
            <div className="im-stat-label">Total pieces</div>
            <div className="im-stat-value">{totalPieces}</div>
          </div>
          <div className="im-stat">
            <div className="im-stat-label">Total value</div>
            <div className="im-stat-value green">₹{total.toFixed(2)}</div>
          </div>
        </div>

        {/* List */}
        <div className="im-list-card">
          <div className="im-list-header">
            <span>Item</span>
            <span>Pieces</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          {items.length === 0 ? (
            <div className="im-empty-state">
              <div className="im-empty-icon">🧺</div>
              <div className="im-empty-title">No items yet</div>
              <div className="im-empty-sub">Add your first item above to get started</div>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={`im-item-row${editingId === item.id ? ' editing' : ''}`}>
                {editingId === item.id ? (
                  <div className="im-edit-inputs">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editPieces}
                      onChange={e => setEditPieces(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                      min="1"
                      step="1"
                    />
                    <input
                      type="number"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                      step="0.01"
                    />
                    <button className="im-save-btn" onClick={() => saveEdit(item.id)}>✓ Save</button>
                    <button className="im-save-btn muted" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="im-item-name">{item.name}</div>
                      <div className="im-item-date">{item.date}</div>
                    </div>
                    <div className="im-item-pieces">{item.pieces} pcs</div>
                    <div className="im-item-price">₹{(item.price * item.pieces).toFixed(2)}</div>
                    <div className="im-item-actions">
                      <button
                        className="im-icon-btn"
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.name}`}
                      >✎</button>
                      <button
                        className="im-icon-btn danger"
                        onClick={() => deleteItem(item.id)}
                        aria-label={`Delete ${item.name}`}
                      >✕</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="im-footer">
          <span className="im-offline-tag">
            <span className="im-dot" />
            Auto-save when 100 items reached
          </span>
          <div className="im-button-group">
            <button className="im-print-btn" onClick={printReceipt}>
              🖨️ Print Receipt
            </button>
            <button className="im-export-btn" onClick={exportToFile}>
              💾 Backup All
            </button>
            <label className="im-import-btn" style={{ cursor: 'pointer' }}>
              📂 Restore Backup
              <input
                type="file"
                accept=".json"
                onChange={importFromFile}
                className="im-file-input"
              />
            </label>
            <button className="im-reset-btn" onClick={resetAllItems}>
              Reset all
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemManager;