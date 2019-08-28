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
			// !item.isCompleted doesn't work due to how JS evaluates null and undefined as false
			if (item.isCompleted) { type = 'project-f'; }
			else if (item.isCompleted === false) { type = 'project-nf'; }
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
	for (const key in lists) {
		list = lists[key];
		Array.from(list.children).forEach((listItem) => {
			if (listItem.dataset.id === objId) {
				list.removeChild(listItem);
			}
		});
	}
}

// Handle which list it get appended to
function appendToList(html, jsonObj) {
	const type = html.dataset.type;
	if (type === 'project-f') { lists.finProjs.appendChild(html); }
	else if (type === 'project-nf') { lists.ipProjs.appendChild(html); }
	else if (type === 'resource') {
		html.querySelector('header').appendChild(createStackType(jsonObj));
		lists.resList.appendChild(html);
	}
	else if (type === 'software') { lists.softList.appendChild(html); }
}

//=== === === HANDLE @click === === ===//

function openPage(event) {
	// Prevent the dropdown button from firing the event
	if (event.target.className !== 'arrow') {
		require('electron').ipcRenderer.send(
			'open-box',
			event.currentTarget.dataset.type+ ', ' + event.currentTarget.dataset.id
		);
	}
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
	article.className = 'item';
	article.dataset.type = type;
	article.dataset.id = id;
	article.addEventListener('click', openPage);
	// Create header and append
	const header = createElem('header');
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
	// create the conatiner to add the svg as a background to
	const svgContainer = createElem('button');
	svgContainer.className = 'arrow';
	article.appendChild(svgContainer);
	return article;
}
function log() {
	console.log('please');

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