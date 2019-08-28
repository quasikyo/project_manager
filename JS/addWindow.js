const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
let type;


ipcRenderer.on('type', async (event, payload) => {
	type = payload;
	document.title = `Add New ${payload.charAt(0).toUpperCase() + payload.substring(1)}`;
	createFormInputs();
});

form.addEventListener('submit', (event) => {
	event.preventDefault();
	// TODO: get input values and create JSON using createJSON.js and forward it to main.js
	// TODO: validate inputs before forwarding
	ipcRenderer.send('create-new', type);
});

async function createFormInputs() {
	// TODO: create form inputs based on the type
	const subBtn = document.querySelector('input[type=submit]');
	const projects = [], resources = [], software = [];
	// Populate projects array
	const projJSON = await getJSON('project');
	for (const key in projJSON) {
		projects.push({name: projJSON[key].name, id: key});
	}
	// Populate resources array
	const resJSON = await getJSON('resource');
	for (const key in resJSON) {
		resources.push({name: resJSON[key].name, id: key});
	}
	// Populate software array
	const softJSON = await getJSON('software');
	for (const key in softJSON) {
		software.push({name: softJSON[key].name, id: key});
	}

	if (type === 'project') {
		projects.forEach((proj) => {
			const h1 = document.createElement('h1');
			const span1 = document.createElement('span');
			span1.textContent = proj.name;
			const span2 = document.createElement('span');
			span2.textContent = `(${proj.id})`;
			h1.appendChild(span1);
			h1.appendChild(span2);
			document.body.appendChild(h1);
		});
	} else if (type === 'resource') {
		console.log(resources);
	} else if (type === 'software') {
		console.log(software);
	}
}