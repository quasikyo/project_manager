const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('valueName', (event, payload) => {
	document.getElementById('h1').textContent = payload;
});