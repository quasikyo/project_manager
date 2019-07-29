const { app, BrowserWindow, ipcMain } = require('electron');
// ipcRenderer for sending events to ipcMain and for retrieving values sent to windows
// ipcMain for receiving evtns sent by ipcRenderer

//=== === === WINDOW REFERENCES === === ===//

let mainWindow;
let projWindow;

//=== === === APP.ON === === ===//

app.on('ready', () => {
	createMainWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//=== === === IPCMAIN.ON === === ===//

ipcMain.on('open-box', (event, payload) => {
	createProjWindow(payload);
});

//=== === === WINDOW CREATORS === === ===//

function createMainWindow() {
	// Create new window
    mainWindow = new BrowserWindow({
		width: 1200,
		height: 1000,
		show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load HTML into window
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	// Show when ready
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
    // Close all windows when main window is closed
    mainWindow.on('closed', () => {
		mainWindow = null;
        app.quit();
	});
}

function createProjWindow(payload) {
	// Create Window
	projWindow = new BrowserWindow({
		width: 1200,
		height: 1000,
		show: false,
        webPreferences: {
            nodeIntegration: true
        }
	});
	// Load HTML
	projWindow.loadURL(`file://${__dirname}/HTML/newWindow.html`);
	// Once ready, send the data and show
	projWindow.once('ready-to-show', () => {
		projWindow.webContents.send('valueName', payload);
		projWindow.show();
	});
	// Garbage collection
	projWindow.on('closed', () => {
		projWindow = null;
	});
}