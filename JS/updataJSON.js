const fs = require('fs');

function updataFile(filePath, newObjId, newObjContent) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) { console.error(err); }
		else {
			const fileContents = JSON.parse(data);
			fileContents[newObjId] = newObjContent;
			const json = JSON.stringify(fileContents);
			fs.writeFile(filePath, json, 'utf8', () => {});
		}
	});
	// call method in loadJSON.js
	renderNewJSON(newObjContent);
}