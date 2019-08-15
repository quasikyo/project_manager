const { app, BrowserWindow, ipcMain, Menu } = require('electron');
// ipcRenderer for sending events to ipcMain and for retrieving values sent to windows
// ipcMain for receiving events sent by ipcRenderer

//=== === === WINDOW REFERENCES === === ===//

let mainWindow;
let detailsWindow;

//=== === === APP.ON === === ===//

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//=== === === IPCMAIN.ON === === ===//

ipcMain.on('open-box', (event, payload) => {
	createDetailsWindow(payload);
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
	mainWindow.loadURL(`file://${__dirname}/HTML/index.html`);
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

function createDetailsWindow(payload) {
	// Create Window
	detailsWindow = new BrowserWindow({
		width: 1200,
		height: 1000,
		parent: mainWindow,
		modal: false,
		show: false,
        webPreferences: {
            nodeIntegration: true
        }
	});
	// Load HTML
	detailsWindow.loadURL(`file://${__dirname}/HTML/detailsWindow.html`);
	// Once ready, send the data and show
	detailsWindow.once('ready-to-show', () => {
		detailsWindow.webContents.send('typeAndId', payload);
		detailsWindow.show();
	});
	// Garbage collection
	detailsWindow.on('closed', () => {
		detailsWindow = null;
	});
}

function createNewWindow(type) {
	console.log(type);
}

//=== === === MENU === === ===//
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl + Q',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'New',
		submenu: [
			{
				label: 'Project',
				accelerator: 'CmdOrCtrl + P',
				click() {
					createNewWindow('project');
				}
			},
			{
				label: 'Resource',
				accelerator: 'CmdOrCtrl + R',
				click() {
					createNewWindow('resource');
				}
			},
			{
				label: 'Software/Tool',
				accelerator: 'CmdOrCtrl + s',
				click() {
					createNewWindow('software');
				}
			}
		]
	}
];

// Because macOS does something I don't remmeber
if (process.platform === 'darwin') {
	mainMenuTemplate.unshift({});
}