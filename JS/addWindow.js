const { ipcRenderer } = require('electron');
const getJSON = require('../JS/getJSON');
const { createProject, createResource, createSoftware } = require('../JS/createJSON');

const form = document.querySelector('form');
const subBtn = document.querySelector('input[type=submit]');
let type;

ipcRenderer.on('type', async (event, payload) => {
	type = payload;
	document.title = `Add New ${payload.charAt(0).toUpperCase() + payload.substr(1)}`;
	createFormInputs();
});

form.addEventListener('submit', (event) => {
	event.preventDefault();
	// TODO: get input values and create JSON using createJSON.js and forward it to main.js
	// TODO: validate inputs before forwarding
	const payload = {
		type,
		content: createProject(
			document.querySelector('#i_name').value,
			document.querySelector('#i_desc').value,
			document.querySelector('#i_isCompleted').checked,
			[],
			[]
		)
	};
	ipcRenderer.send('create-new', payload);
});

// TODO: shorten the HTML generation code (seriously, this is horrible to look at)
function createFormInputs() {
	if (type === 'project') {
		// isCompleted label and checkbox
		const isCompleted = document.createElement('template');
		isCompleted.innerHTML = `<label for="i_isCompleted">Completed?</label>
								 <input id="i_isCompleted" type=checkbox>`
		form.insertBefore(isCompleted.content.cloneNode(true), subBtn);
	} else if (type === 'resource') {
		// Stack select and its options
		const labelStackSelect = document.createElement('label');
		labelStackSelect.setAttribute('for', 'i_resStack');
		labelStackSelect.textContent = 'Where in the stack?';
		const stackSelect = document.createElement('select');
		stackSelect.id = 'i_resStack';
		const stackOptionTemplate = document.createElement('template');
		stackOptionTemplate.innerHTML = `<option value="Frontend">Frontend</option>`
		stackSelect.appendChild(stackOptionTemplate.content.cloneNode(true));
		stackOptionTemplate.innerHTML = `<option value="Backend">Backend</option>`
		stackSelect.appendChild(stackOptionTemplate.content.cloneNode(true));
		stackOptionTemplate.innerHTML = `<option value="Fullstack">Fullstack</option>`
		stackSelect.appendChild(stackOptionTemplate.content.cloneNode(true));
		form.insertBefore(labelStackSelect, subBtn);
		form.insertBefore(stackSelect, subBtn);
		// Type select and its options
		const labelTypeSelect = document.createElement('label');
		labelTypeSelect.setAttribute('for', 'i_resType');
		labelTypeSelect.textContent = 'What type of resource?';
		const typeSelect = document.createElement('select');
		typeSelect.id = 'i_resType';
		const typeOptionTemplate = document.createElement('template');
		typeOptionTemplate.innerHTML = `<option value="Framework">Framework</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		typeOptionTemplate.innerHTML = `<option value="Library">Library</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		typeOptionTemplate.innerHTML = `<option value="Toolkit">Toolkit</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		form.insertBefore(labelTypeSelect, subBtn);
		form.insertBefore(typeSelect, subBtn);
		// Versions
		const labelVersions = document.createElement('label');
		labelVersions.setAttribute('for', 'i_resVersions');
		labelVersions.textContent = 'Please type all significant versions separated by a space.'
		const versions = document.createElement('input');
		versions.id = 'i_resVersions';
		versions.type = 'text';
		form.insertBefore(labelVersions, subBtn);
		form.insertBefore(versions, subBtn);
	} else if (type === 'software') {
		// TODO: populate select with more options and implement 'other' feature
		const labelType = document.createElement('label');
		labelType.setAttribute('for', 'i_softType');
		labelType.textContent = 'Please select the type of software.';
		const typeSelect = document.createElement('select');
		typeSelect.id = 'i_softType';
		const typeOptionTemplate = document.createElement('template');
		typeOptionTemplate.innerHTML = `<option value="IDE">IDE</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		typeOptionTemplate.innerHTML = `<option value="Text Editor">Text Editor</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		typeOptionTemplate.innerHTML = `<option value="Design Tool">Design Tool</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		typeOptionTemplate.innerHTML = `<option value="Other">Other</option>`
		typeSelect.appendChild(typeOptionTemplate.content.cloneNode(true));
		form.insertBefore(labelType, subBtn);
		form.insertBefore(typeSelect, subBtn);
	}
	createDropdowns(type);
}

async function createDropdowns(excludeType) {
	const types = ['project', 'resource', 'software'].filter((type1) => type1 !== excludeType );
	const jsonArr = [await getJSON(types[0]), await getJSON(types[1])];
	const dataLists = [[], []];
	jsonArr.forEach((json, idx) => {
		for (const key in json) {
			dataLists[idx].push({name: json[key].name, id: key});
		}
		const optionsContainer = document.createElement('ul');
		optionsContainer.className = 'options';
		const label = document.createElement('h3');
		label.className = 'label';
		label.textContent = `Involved with ${types[idx].charAt(0).toUpperCase()}${types[idx].substring(1)}s`;
		const svgContainer = document.createElement('button');
		svgContainer.className = 'arrow';
		label.addEventListener('click', () => {
			optionsContainer.classList.toggle('show-options');
			svgContainer.classList.toggle('is-selected');
			if (optionsContainer.style.maxHeight) { optionsContainer.style.maxHeight = null; }
			else { optionsContainer.style.maxHeight = optionsContainer.scrollHeight + 'px'; }
		});
		label.appendChild(svgContainer);
		dataLists[idx].forEach((opt, index) => {
			const optionEntry = document.createElement('li');
			optionEntry.className = 'option';
			optionsContainer.appendChild(optionEntry);
			const option = document.createElement('input');
			option.id = `${types[idx]}Option${index}`;
			option.type = 'checkbox';
			option.value = opt.id;
			optionEntry.appendChild(option);
			const optionLabel = document.createElement('label');
			optionLabel.setAttribute('for', `${types[idx]}Option${index}`);
			optionLabel.textContent = opt.name;
			optionEntry.appendChild(optionLabel)
		});
		form.insertBefore(label, subBtn);
		form.insertBefore(optionsContainer, subBtn);
	});
}