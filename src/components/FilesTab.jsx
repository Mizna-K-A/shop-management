import React from 'react';
import Swal from 'sweetalert2';

const FilesTab = ({ onReset, items, onImportBackup }) => {

  const handleExportBackup = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup_${timestamp}.json`;
      
      const backupData = {
        exportedAt: new Date().toISOString(),
        items: items,
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
        title: 'Backup Created',
        text: `Backup created: ${backupFileName}`,
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error creating backup',
        confirmButtonColor: '#4f46e5'
      });
    }
  };

  const handleImportBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.items && Array.isArray(data.items)) {
          onImportBackup(data.items);
          Swal.fire({
            icon: 'success',
            title: 'Imported',
            text: 'Backup imported successfully',
            confirmButtonColor: '#10b981'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Format',
            text: 'Invalid backup file format',
            confirmButtonColor: '#4f46e5'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error importing backup',
          confirmButtonColor: '#4f46e5'
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = null;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 md:mb-8 tracking-tight">Data Management</h2>
        
        {/* Reset Data */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 mb-8 border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Reset All Data</h3>
          <p className="text-slate-600 mb-6">
            This will permanently delete all your items and clear the local storage. Please export a backup first if you want to keep your data.
          </p>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-rose-100 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all font-bold"
          >
            🗑️ Reset All Items
          </button>
        </div>
        
        {/* Backup and Restore */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 mb-8 border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Backup & Restore</h3>
          <p className="text-slate-600 mb-6">
            Export all your current items to a JSON file, or import items from a previously saved backup. Note: Importing will append to your current items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleExportBackup}
              disabled={items.length === 0}
              className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              💾 Export Backup
            </button>
            <label className="w-full sm:w-auto text-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold cursor-pointer inline-block">
              📂 Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesTab;