// preload.js for Electron
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Send an IPC message from renderer to main
  send: (channel, data) => {
    // Whitelist channels
    const validChannels = ['toMainTest']; // Example channel
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // Receive an IPC message from main to renderer
  on: (channel, callback) => {
    const validChannels = ['fromMainTest']; // Example channel
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes \`sender\`
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  // Example of an invoke/handle pair (two-way communication)
  invoke: async (channel, data) => {
    const validChannels = ['my-invokable-ipc']; // Example channel
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
  }
});

console.log('preload.js loaded and electronAPI exposed.');
