const fs = require('fs');

renderJSON('project');
renderJSON('resource');
// renderJSON('software');
async function renderJSON(type) {
	let json;
	if (type === 'project') { json = await getProjects(); }
	else if (type === 'resource') { json = await getResources(); }
	// else if (type === 'software') { json = await getSoftware(); }
	else { console.error('Invalid renderJSON type.'); return; }

	// Collect necessary DOM references
	const finProjs = document.querySelector('#finishedProjects .projects-list');
	const ipProjs = document.querySelector('#ipProjects .projects-list');
	const resList = document.querySelector('#resources .resources-list');

	// Create elements based on json files and add to DOM
	for (const id in json) {
		const item = json[id];
		const article = createBaseArticle(item);
		if (item.status === 'finished') { finProjs.appendChild(article); }
		else if (item.status === 'in progress') { ipProjs.appendChild(article); }
		// Only resources.json has a versions field
		else if (typeof item.versions === 'object') {
			article.querySelector('h3.header').appendChild(createStackType(item));
			resList.appendChild(article);
		}
	}
}

//=== === === HANDLE @click === === ===//
function openPage() {
	console.log('hey');
}

//=== === === HELPER FUNCTIONS === === ===//

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

function createElem(elem) {
	return document.createElement(elem);
}

function createBaseArticle(getTextFor) {
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