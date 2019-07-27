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

// Render everything
function renderJSON(types) {
	types.forEach(async function(type) {
		let json;
		if (type === 'project') { json = await getProjects(); }
		else if (type === 'resource') { json = await getResources(); }
		else if (type === 'software') { json = await getSoftware(); }
		else {
			console.error(
				'Invalid renderJSON type. Accepted types are "project", "resource", "software".'
			);
			return;
		}

		// Create elements based on json files and add to DOM
		for (const id in json) {
			const item = json[id];
			const article = createArticle(item);
			// for projects.json
			if (item.status === 'finished') { lists.finProjs.appendChild(article); }
			else if (item.status === 'in progress') { lists.ipProjs.appendChild(article); }
			// Only resources.json has a versions field - for resources.json
			else if (typeof item.versions === 'object') {
				article.querySelector('h3.header').appendChild(createStackType(item));
				lists.resList.appendChild(article);
			}
			// Same concept as above - for software.json
			else if (typeof item.usedWithRes === 'object') { lists.softList.appendChild(article); }
		}
	});
	// Check for empty lists - DOESN'T WORK DUE TO ASYNC/AWAIT; this stuff gets run during the await
	/* for (const key in lists) {
		list = lists[key];
		if (list.childElementCount === 0) {
			list.appendChild(createArticle(null));
		}
	} */
}

// Render new JSON objects
function renderNewJSON(newObj) {
	const article = createArticle(newObj);
	// for projects.json
	if (newObj.status === 'finished') { lists.finProjs.appendChild(article); }
	else if (newObj.status === 'in progress') { lists.ipProjs.appendChild(article); }
	// Only resources.json has a versions field - for resources.json
	else if (typeof newObj.versions === 'object') {
		article.querySelector('h3.header').appendChild(createStackType(newObj));
		lists.resList.appendChild(article);
	}
	// Same concept as above - for software.json
	else if (typeof newObj.usedWithRes === 'object') { lists.softList.appendChild(article); }
}

//=== === === HANDLE @click === === ===//

function openPage(event) {
	ipcRenderer.send('open-box', 'click');
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