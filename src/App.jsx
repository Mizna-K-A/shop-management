import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AddItemTab from './components/AddItemTab';
import ItemsListTab from './components/ItemsListTab';
import FilesTab from './components/FilesTab';
import DashboardTab from './components/DashboardTab';
import BillingTab from './components/BillingTab';
import api from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  const [items, setItems] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(1);
  const [fileItemsCount, setFileItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const filesList = await api.getFilesList();
        if (filesList && filesList.length > 0) {
          const latestFile = filesList[0];
          const fullFile = await api.loadFile(latestFile.fileNumber);
          
          if (fullFile.totalItems < 100) {
            setItems(fullFile.items || []);
            setCurrentFileIndex(fullFile.fileNumber);
            setFileItemsCount(fullFile.totalItems);
          } else {
            setItems([]);
            setCurrentFileIndex(fullFile.fileNumber + 1);
            setFileItemsCount(0);
          }
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addItem = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      totalPrice: item.price * item.pieces,
      date: new Date().toLocaleDateString()
    };
    
    const newItems = [...items, newItem];
    const newCount = fileItemsCount + 1;
    
    if (newCount >= 100) {
      saveToFile(newItems, currentFileIndex, false);
      setItems([]);
      setFileItemsCount(0);
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      setItems(newItems);
      setFileItemsCount(newCount);
      saveToFile(newItems, currentFileIndex, true);
    }
  };

  const saveToFile = async (itemsToSave, fileNumber, silent = false) => {
    setLoading(true);
    try {
      const response = await api.saveItems({
        fileNumber,
        items: itemsToSave,
        fileItemsCount: itemsToSave.length
      });
      
      if (response.success && !silent) {
        alert(`File f${fileNumber} saved successfully!`);
      }
    } catch (error) {
      console.error('Error saving to file:', error);
      if (!silent) alert('Error saving file to server');
    } finally {
      setLoading(false);
    }
  };

  const manualSave = async () => {
    if (items.length === 0) {
      alert('No items to save!');
      return;
    }
    
    await saveToFile(items, currentFileIndex);
  };

  const deleteItem = (id) => {
    if (window.confirm('Delete this item?')) {
      const newItems = items.filter(i => i.id !== id);
      setItems(newItems);
      setFileItemsCount(fileItemsCount - 1);
      saveToFile(newItems, currentFileIndex, true);
    }
  };

  const updateItem = (id, updatedItem) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updatedItem, totalPrice: updatedItem.price * updatedItem.pieces } : item
    );
    setItems(newItems);
    saveToFile(newItems, currentFileIndex, true);
  };

  const resetAllItems = () => {
    if (window.confirm('Are you sure you want to reset all items?')) {
      setItems([]);
      setFileItemsCount(0);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 print:block print:bg-white print:h-auto">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto print:overflow-visible">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            items={items}
            currentFileIndex={currentFileIndex}
            fileItemsCount={fileItemsCount}
          />
        )}
        
        {activeTab === 'billing' && (
          <BillingTab items={items} />
        )}
        
        {activeTab === 'items' && (
          <div className="p-4 lg:p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-1">
              <AddItemTab onAddItem={addItem} loading={loading} />
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
            currentFileIndex={currentFileIndex}
            fileItemsCount={fileItemsCount}
            onManualSave={manualSave}
            onReset={resetAllItems}
            items={items}
          />
        )}
      </div>
    </div>
  );
}

export default App;