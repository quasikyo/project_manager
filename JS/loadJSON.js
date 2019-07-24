const fs = require('fs');
const electron = require('electron');
const { ipcRenderer } = electron;

// Collect necessary DOM references
const lists = {
	finProjs: document.querySelector('#finishedProjects .projects-list'),
	ipProjs: document.querySelector('#ipProjects .projects-list'),
	resList: document.querySelector('#resources .resources-list'),
	softList: document.querySelector('#software .software-list')
};

// Render everything to DOM
renderJSON('project');
renderJSON('resource');
renderJSON('software');
// emptyLists();

//=== === === HANDLE ALL ACTIONS TO RENDER TO DOM === === ===//

async function renderJSON(type) {
	let json;
	if (type === 'project') { json = await getProjects(); }
	else if (type === 'resource') { json = await getResources(); }
	else if (type === 'software') { json = await getSoftware(); }
	else { console.error('Invalid renderJSON type. Accepted types are "project", "resource", "software".'); return; }

	// Create elements based on json files and add to DOM
	for (const id in json) {
		const item = json[id];
		const article = createArticle(item);
		if (item.status === 'finished') { lists.finProjs.appendChild(article); }
		else if (item.status === 'in progress') { lists.ipProjs.appendChild(article); }
		// Only resources.json has a versions field
		else if (typeof item.versions === 'object') {
			article.querySelector('h3.header').appendChild(createStackType(item));
			lists.resList.appendChild(article);
		}
		// Same concept as above
		else if (typeof item.usedWithRes === 'object') {
			lists.softList.appendChild(article);
		}
	}

}

//=== === === HANDLE @click === === ===//

function openPage(event) {
	ipcRenderer.send('open-box', 'whatup');
}

//=== === === GET JSON === === ===//

async function getProjects() {
	const resp = await fetch('./data/projects.json');
	const data = await resp.json();
	return data;
}

async function getResources() {
	const resp = await fetch('./data/resources.json');
	const data = await resp.json();
	return data;
}

async function getSoftware() {
	const resp = await fetch('./data/software.json');
	const data = resp.json();
	return data;
}

//=== === === TODO: CHECK FOR EMPTY LISTS === === ===//

//If a list is empty, add a "Nothing found element to it."
/* function emptyLists() {
	console.log(lists.finProjs.childElementCount);
	for (const list in lists) {

		if (lists[list].childElementCount === 0) {
			lists[list].appendChild(createEmptyArticle());
		}
	}
} */

//=== === === CREATE DOM ELEMENTS === === ===//

function createElem(elem) {
	return document.createElement(elem);
}

function createArticle(getTextFor) {
	// Create article.box, append, and add @click listener
	const article = createElem('article');
	article.className = 'box';
	article.addEventListener('click', openPage);
	// Create h3.header and append
	const header = createElem('h3');
	header.className = `header flex just-cont-btwn`;
	header.textContent = getTextFor.name;
	article.appendChild(header);
	// Create div.content and append
	const content = createElem('div');
	content.className = 'content';
	article.appendChild(content);
	// create p.desc and append
	const desc = createElem('p');
	desc.className = 'desc';
	desc.textContent = getTextFor.desc
	content.appendChild(desc);

	return article;
}
// Honestly, I could probably combine the two surrounding methods,
// but no.
function createEmptyArticle() {
	// Create article.box, append, and add @click listener
	const article = createElem('article');
	article.className = 'box';
	// Create h3 and append
	const header = createElem('h3');
	header.className = `header`;
	header.textContent = 'Nothing Found';
	article.appendChild(header);
	// Create div.content and append
	const content = createElem('div');
	content.className = 'content';
	article.appendChild(content);
	// create p.desc and append
	const desc = createElem('p');
	desc.className = 'desc';
	desc.textContent = 'This section is empty.';
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