const { app, BrowserWindow, ipcMain } = require('electron');

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
	console.log(payload);
});

//=== === === WINDOW CREATORS === === ===//

function createMainWindow() {
	// Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load HTML into window
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // Close all windows when main window is closed
    mainWindow.on('closed', () => {
		mainWindow = null;
        app.quit();
	});
}