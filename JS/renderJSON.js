const electron = require('electron');
const { ipcRenderer } = electron;

// Collect necessary DOM references
const lists = {
	finProjs: document.querySelector('#finishedProjects .projects-list'),
	ipProjs: document.querySelector('#ipProjects .projects-list'),
	resList: document.querySelector('#resources .resources-list'),
	softList: document.querySelector('#software .software-list')
};

// Inital call
renderJSON(['project', 'resource', 'software']);

//=== === === HANDLE ALL ACTIONS TO RENDER TO DOM === === ===//

// Render everything from JSON files
function renderJSON(types) {
	types.forEach(async function(type) {
		let json;
		if (type === 'project') { json = await getJSON('./data/projects.json'); }
		else if (type === 'resource') { json = await getJSON('./data/resources.json'); }
		else if (type === 'software') { json = await getJSON('./data/software.json'); }
		else {
			console.error('Invalid renderJSON type. Accepted types are "project", "resource", "software".');
			return;
		}

		// Create elements based on json files and add to DOM
		for (const id in json) {
			// Single object from JSON
			const item = json[id];
			// Create HTML based on JSON
			const article = createArticle(item, type, id);
			// Add HTML to DOM
			appendToList(article, item);
		}
	});
}

// Render new JSON objects so you can avoid reloading to see changes
function addToRender(newObj) {
	// Create HTML based on JSON
	const article = createArticle(newObj);
	// Add HTML to DOM
	appendToList(article, newObj);
}

// Remove JSON from render to avoid reloading
function removeFromRender(oldObj) {
	// Create HTML to be used for comparison
	const article = createArticle(oldObj);
}

// Handle which list it get appended to
// @param html    - HTML to be added
// @param jsonObj - the JSON data to be used to identify which list
function appendToList(html, jsonObj) {
	// for projects.json
	// !item.completed doesn't work due to how JS evaluates null and undefined as false
	if (jsonObj.completed) { lists.finProjs.appendChild(html); }
	else if (jsonObj.completed === false) { lists.ipProjs.appendChild(html); }
	// Only resources.json has a versions field - for resources.json
	else if (typeof jsonObj.versions === 'object') {
		html.querySelector('h3.header').appendChild(createStackType(jsonObj));
		lists.resList.appendChild(html);
	}
	// Same concept as above - for software.json
	else if (typeof jsonObj.usedWithRes === 'object') { lists.softList.appendChild(html); }
}

//=== === === HANDLE @click === === ===//

function openPage(event) {
	ipcRenderer.send('open-box', event.currentTarget.querySelector('h3').textContent);
}

//=== === === GET JSON === === ===//

async function getJSON(filePath) {
	const resp = await fetch(filePath);
	const data = await resp.json();
	return data;
}

//=== === === CREATE DOM ELEMENTS === === ===//

function createElem(elem) {
	return document.createElement(elem);
}

function createArticle(getTextFor, type, id) {
	// Create article.box, set data attributes, and add @click listener
	const article = createElem('article');
	article.className = 'box';
	article.setAttribute('data-type', type);
	article.setAttribute('data-id', id);
	article.addEventListener('click', openPage);
	// Create h3.header and append
	const header = createElem('h3');
	header.className = `header flex just-cont-btwn`;
	header.textContent = getTextFor !== null ? getTextFor.name : 'Nothing Found';
	article.appendChild(header);
	// Create div.content and append
	const content = createElem('div');
	content.className = 'content';
	article.appendChild(content);
	// create p.desc and append
	const desc = createElem('p');
	desc.className = 'desc';
	desc.textContent = getTextFor !== null ? getTextFor.desc : 'This section is empty';
	content.appendChild(desc);

	return article;
}

function createStackType(getTextFor) {
	// Create div.stack-type and append
	const stackType = createElem('div');
	stackType.className = `stack-type sub-header`;
	// Create div.stack and append
	const stack = createElem('span');
	stack.className = 'stack';
	stack.textContent = `${getTextFor.stack} `;
	stackType.appendChild(stack);
	// Create div.type and append
	const type = createElem('span');
	type.className = 'type';
	type.textContent = getTextFor.type;
	stackType.appendChild(type);

	return stackType;
}