const { readFile, writeFile } = require('fs');

require('electron').ipcRenderer.on('newJSON', (event, payload) => {
	const path = `./data/${payload.type}.json`;
	// Get the ID
	let id;
	for (const key in payload.content) { id = key; break; }
	addToJSON(path, payload.content[id], id, payload.type);
});

function addToJSON(filePath, newObjContent, newObjId, type) {
	readFile(filePath, {encoding: 'utf8'}, (err, data) => {
		if (err) { console.error(err); }
		else {
			// Convert string to JSON
			const fileContents = JSON.parse(data);
			// Define a new key and it's value
			fileContents[newObjId] = newObjContent;
			// Convert JSON to string
			const json = JSON.stringify(fileContents);
			// Rewrite the file with new addition
			writeFile(filePath, json, {encoding: 'utf8'}, (err) => { if (err) { console.error(err); } });
			addToRender(newObjContent, type, newObjId);
		}
	});
}

function removeFromJSON(filePath, objId) {
	readFile(filePath, {encoding: 'utf8'}, (err, data) => {
		if (err) { console.error(err); }
		else {
			// Convert string to JSON
			const fileContents = JSON.parse(data);
			// Delete object from JSON
			delete fileContents[objId];
			// Convert JSON to string
			const json = JSON.stringify(fileContents);
			// Rewrite the file with applied changes
			writeFile(filePath, json, {encoding: 'utf8'}, (err) => { if (err) { console.error(err); } });
			removeFromRender(objId);
		}
	});
}