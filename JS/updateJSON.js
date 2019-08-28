const fs = require('fs');

require('electron').ipcRenderer.on('newJSON', (event, payload) => {
	// TODO: handle adding the payload to JSON
});

function addToJSON(filePath, newObjId, newObjContent) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) { console.error(err); }
		else {
			// Convert JSON to string
			const fileContents = JSON.parse(data);
			// Define a new key and it's value
			fileContents[newObjId] = newObjContent;
			// Convert string to JSON
			const json = JSON.stringify(fileContents);
			// Rewrite the file with new addition
			fs.writeFile(filePath, json, 'utf8', () => {});
		}
	});
	// call method in index.js
	addToRender(newObjContent);
}

function removeFromJSON(filePath, objId) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) { console.error(err); }
		else {
			// Convert JSON to string
			const fileContents = JSON.parse(data);
			// Delete object from JSON
			delete fileContents[objId];
			// Convert string to JSON
			const json = JSON.stringify(fileContents);
			// Rewrite the file with applied changes
			fs.writeFile(filePath, json, 'utf8', () => {});
		}
	});
	// call method in index.js
	removeFromRender(objId);
}