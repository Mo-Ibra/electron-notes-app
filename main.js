require('electron-reload')(__dirname);

const { app, BrowserWindow, ipcMain } = require('electron');
const db = require('./database');

let win;

/**
 * Creates the main application window
 *
 * @function createWindow
 */
function createWindow() {
  /**
   * Creates the main application window
   *
   * @param {Object} options - An object containing the window options
   * @param {Number} options.width - The width of the window
   * @param {Number} options.height - The height of the window
   * @param {Object} options.webPreferences - An object containing the web preferences
   * @param {Boolean} options.webPreferences.nodeIntegration - Whether Node.js is enabled
   *
   * @returns {BrowserWindow} - The created window
   */
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('index.html');
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-notes', () => db.getAllNotes())
ipcMain.handle('add-note', (event, content) => db.addNote(content))
ipcMain.handle('delete-notes', () => db.deleteAllNotes())
ipcMain.handle('update-note', (event, id, content) => db.updateNote(id, content));