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
	types.forEach(async (type) => {
		const json = await getJSON(type)
		// Create elements based on json files and add to DOM
		for (const id in json) {
			// Single object from JSON
			const item = json[id];
			// Set finished and not finished project type
			// the '=== false' is required cause JS will run an else clause if it null/undefined
			if (item.completed) { type = 'project-f'; }
			else if (item.completed === false) { type = 'project-nf'; }
			// Create HTML based on JSON
			const article = createArticle(item, type, id);
			// Add HTML to DOM
			appendToList(article, item);
		}
	});
}

// Render new JSON objects so you can avoid reloading to see changes
function addToRender(obj) {
	// Create HTML based on JSON
	const article = createArticle(obj);
	// Add HTML to DOM
	appendToList(article, obj);
}

// Remove JSON from render to avoid reloading
function removeFromRender(objId) {
	// Go through all every HTML list (could be better, only go through the list it is in)
	// Also, this makes all the files have shared ids (we can't use the same id in a different file)
	for (const key in lists) {
		list = lists[key];
		Array.from(list.children).forEach((listItem) => {
			if (listItem.dataset.id === objId) {
				list.removeChild(listItem);
			}
		});

		// TODO: doesn't work but I want it to
		// const asArray = [...list.children];
		// Filter will remove items if evaluation is false
		// const newArray = asArray.filter((listItem) => { listItem.dataset.id !== objId });
		// list.children = newArray;
	}
}

// Handle which list it get appended to
function appendToList(html, jsonObj) {
	// for projects.json
	// !item.completed doesn't work due to how JS evaluates null and undefined as false
	if (jsonObj.completed) { lists.finProjs.appendChild(html); }
	else if (jsonObj.completed === false) { lists.ipProjs.appendChild(html); }
	else if (html.dataset.type === 'resource') {
		html.querySelector('header').appendChild(createStackType(jsonObj));
		lists.resList.appendChild(html);
	}
	else if (html.dataset.type === 'software') { lists.softList.appendChild(html); }
}

//=== === === HANDLE @click === === ===//

function openPage(event) {
	require('electron').ipcRenderer.send(
		'open-box',
		event.currentTarget.dataset.type+ ', ' + event.currentTarget.dataset.id
	);
}

//=== === === CREATE DOM ELEMENTS === === ===//

function createElem(elem) {
	return document.createElement(elem);
}

// TODO: instead of creating the DOM elements in JS
// use a template tag
function createArticle(getTextFor, type, id) {
	// Create article.box, set data attributes, and add @click listener
	const article = createElem('article');
	article.className = 'box';
	article.dataset.type = type;
	article.dataset.id = id;
	article.addEventListener('click', openPage);
	// Create header and append
	const header = createElem('header');
	header.className = `header flex just-cont-btwn align-items-cent`;
	article.appendChild(header);
	// Create h3 and append
	const h3 = createElem('h3');
	h3.textContent = getTextFor !== null ? getTextFor.name : 'Nothing Found';
	header.appendChild(h3);
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
	stackType.className = `stack-type sub-header sh-bold`;
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