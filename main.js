const { app, BrowserWindow } = require('electron');

// Listen for app to be ready
app.on('ready', () => {
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
        app.quit();
	});
});