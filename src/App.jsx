import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Sidebar from './components/Sidebar';
import AddItemTab from './components/AddItemTab';
import ItemsListTab from './components/ItemsListTab';
import FilesTab from './components/FilesTab';
import DashboardTab from './components/DashboardTab';
import BillingTab from './components/BillingTab';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('shop_items');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('shop_items', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      totalPrice: item.price * item.pieces,
      date: new Date().toLocaleDateString()
    };
    
    setItems(prevItems => [...prevItems, newItem]);
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(prevItems => prevItems.filter(i => i.id !== id));
      }
    });
  };

  const updateItem = (id, updatedItem) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, ...updatedItem, totalPrice: updatedItem.price * updatedItem.pieces } : item
    ));
  };

  const resetAllItems = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to reset all items?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, reset all!'
    }).then((result) => {
      if (result.isConfirmed) {
        setItems([]);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 print:block print:bg-white print:h-auto">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible">
        {activeTab === 'dashboard' && (
          <DashboardTab items={items} />
        )}
        
        {activeTab === 'billing' && (
          <BillingTab items={items} />
        )}
        
        {activeTab === 'items' && (
          <div className="p-4 lg:p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-1">
              <AddItemTab onAddItem={addItem} loading={false} />
            </div>
            <div className="lg:col-span-2">
              <ItemsListTab 
                items={items}
                onDeleteItem={deleteItem}
                onUpdateItem={updateItem}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'files' && (
          <FilesTab 
            onReset={resetAllItems}
            items={items}
            onImportBackup={(importedItems) => setItems(prev => {
              const existingIds = new Set(prev.map(item => item.id));
              const newItems = importedItems.filter(item => !existingIds.has(item.id));
              return [...prev, ...newItems];
            })}
          />
        )}
      </div>
    </div>
  );
}

export default App;