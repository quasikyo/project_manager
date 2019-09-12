const { ipcRenderer } = require('electron');
const getJSON = require('../JS/getJSON');

ipcRenderer.on('typeAndId', async (event, payload) => {
	// Get JSON
	const jsonRef = {
		type: payload.split(', ')[0],
		id: payload.split(', ')[1]
	}
	if (jsonRef.type.includes('project')) { jsonRef.type = 'project'; }
	const json = (await getJSON(jsonRef.type))[jsonRef.id];
	// Fill in page
	document.querySelector('#mainHeader #name').textContent = json.name;
	document.querySelector('#mainHeader .sub-header').textContent = json.desc;
	document.title = `${json.name} [${jsonRef.type.charAt(0).toUpperCase() + jsonRef.type.substr(1)}]`;
});
