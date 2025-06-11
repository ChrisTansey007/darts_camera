const { app, BrowserWindow } = require('electron');
const path = require('path');
// const url = require('url'); // No longer needed for new loadFile method
const isDev = require('electron-is-dev');

if (isDev) {
  require('electron-debug')({ showDevTools: true, devToolsMode: 'right' });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Don't show initially
    webPreferences: {
      nodeIntegration: false, // Best practice: disable nodeIntegration
      contextIsolation: true,  // Best practice: enable contextIsolation
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools(); // electron-debug can handle this
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
