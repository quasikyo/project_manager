// import { getProjects, getResources, createElem } from './api.js';

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

renderProjectsToDom();
renderResourcesToDom();
async function renderProjectsToDom() {
	const finProjs = document.querySelector('#finishedProjects .projects-list');
	const ipProjs = document.querySelector('#ipProjects .projects-list');

	const projects = await getProjects();
	for (const projId in projects) {
		const proj = projects[projId];
		// Create article.box and append
		const article = createElem('article');
		article.className = 'box';
		if (proj.status === 'finished') {
			finProjs.appendChild(article);
		}
		else {
			// proj.status === 'in progress'
			ipProjs.appendChild(article);
		}
		// Create h3.header and append
		const header = createElem('h3');
		header.className = 'header';
		header.textContent = proj.name;
		article.appendChild(header);
		// Create div.content and append
		const content = createElem('div');
		content.className = 'content';
		article.appendChild(content);
		// create p.desc and append
		const desc = createElem('p');
		desc.className = 'desc';
		desc.textContent = proj.desc;
		content.appendChild(desc);
	}
}

async function renderResourcesToDom() {
	const resList = document.querySelector('#resources .resources-list');

	const resources = await getResources();
	for (const resId in resources) {
		const res = resources[resId];
		// Create article.box and append
		const article = createElem('article');
		article.className = 'box';
		resList.appendChild(article);
		// Create h3.header and append
		const header = createElem('h3');
		header.className = `header flex just-cont-btwn`;
		header.textContent = `${res.name}@${res.ver}`;
		article.appendChild(header);
		// Create div.stack-type and append
		const stackType = createElem('div');
		stackType.className = `stack-type sub-header`;
		header.appendChild(stackType);
		// Create div.stack and div.type and append
		const stack = createElem('span');
		stack.className = 'stack';
		stack.textContent = `${res.stack} `;
		const type = createElem('span');
		type.className = 'type';
		type.textContent = res.type;
		stackType.appendChild(stack);
		stackType.appendChild(type);
		// Create div.content and append
		const content = createElem('div');
		content.className = 'content';
		article.appendChild(content);
	}
}