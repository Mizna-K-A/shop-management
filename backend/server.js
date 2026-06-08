const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Data directory — all item files are stored here
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// Helper: file path for a given file number
// ─────────────────────────────────────────────
const getFilePath = (fileNumber) =>
  path.join(DATA_DIR, `f${fileNumber}.json`);

// ─────────────────────────────────────────────
// POST /api/save-items
// Body: { fileNumber, items, fileItemsCount }
// Saves items array into data/f<N>.json
// ─────────────────────────────────────────────
app.post('/api/save-items', (req, res) => {
  try {
    const { fileNumber, items, fileItemsCount } = req.body;

    if (!fileNumber || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const totalValue = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    const fileData = {
      fileName: `f${fileNumber}`,
      fileNumber,
      totalItems: items.length,
      totalValue,
      createdDate: new Date().toISOString(),
      items,
    };

    fs.writeFileSync(getFilePath(fileNumber), JSON.stringify(fileData, null, 2));

    res.json({ success: true, message: `File f${fileNumber} saved`, fileName: `f${fileNumber}.json` });
  } catch (err) {
    console.error('save-items error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/load-file/:fileNumber
// Returns the full file data including items[]
// ─────────────────────────────────────────────
app.get('/api/load-file/:fileNumber', (req, res) => {
  try {
    const filePath = getFilePath(req.params.fileNumber);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('load-file error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/files-list
// Returns metadata of all saved files (sorted newest first)
// ─────────────────────────────────────────────
app.get('/api/files-list', (req, res) => {
  try {
    const jsonFiles = fs
      .readdirSync(DATA_DIR)
      .filter((f) => f.endsWith('.json') && !f.startsWith('backup_'));

    const filesList = jsonFiles
      .map((fileName) => {
        try {
          const data = JSON.parse(
            fs.readFileSync(path.join(DATA_DIR, fileName), 'utf-8')
          );
          return {
            fileName: data.fileName,
            fileNumber: data.fileNumber,
            totalItems: data.totalItems,
            totalValue: data.totalValue,
            createdDate: data.createdDate,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    res.json(filesList);
  } catch (err) {
    console.error('files-list error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/export-backup
// Body: { items, currentFileIndex, fileItemsCount }
// Creates a timestamped backup JSON file
// ─────────────────────────────────────────────
app.post('/api/export-backup', (req, res) => {
  try {
    const { items, currentFileIndex, fileItemsCount } = req.body;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${timestamp}.json`;
    const backupPath = path.join(DATA_DIR, backupFileName);

    const backupData = {
      exportedAt: new Date().toISOString(),
      currentFileIndex,
      fileItemsCount,
      items,
    };

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    res.json({ success: true, fileName: backupFileName });
  } catch (err) {
    console.error('export-backup error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/import-backup
// Body: { backupData: { items, currentFileIndex, fileItemsCount, ... } }
// Restores items from a backup
// ─────────────────────────────────────────────
app.post('/api/import-backup', (req, res) => {
  try {
    const { backupData } = req.body;

    if (!backupData || !Array.isArray(backupData.items)) {
      return res.status(400).json({ success: false, message: 'Invalid backup data' });
    }

    // Save backup items into the appropriate file slot
    const fileNumber = backupData.currentFileIndex || 1;
    const totalValue = backupData.items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

    const fileData = {
      fileName: `f${fileNumber}`,
      fileNumber,
      totalItems: backupData.items.length,
      totalValue,
      createdDate: new Date().toISOString(),
      items: backupData.items,
    };

    fs.writeFileSync(getFilePath(fileNumber), JSON.stringify(fileData, null, 2));

    res.json({
      success: true,
      message: 'Backup imported successfully',
      currentFileIndex: backupData.currentFileIndex,
      fileItemsCount: backupData.fileItemsCount,
      items: backupData.items,
    });
  } catch (err) {
    console.error('import-backup error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Shop Management backend running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${DATA_DIR}`);
});
