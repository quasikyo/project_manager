const getJSON = require('../JS/getJSON');

// Collect necessary DOM references
const lists = {
	"project-f": document.querySelector('#finishedProjects .projects-list'),
	"project-nf": document.querySelector('#ipProjects .projects-list'),
	"resource": document.querySelector('#resources .resources-list'),
	"software": document.querySelector('#software .software-list')
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
			// Create HTML based on JSON
			const article = createArticle(item, type, id);
			// Add HTML to DOM
			appendToList(article, item);
		}
	});
}

// Render new JSON objects so you can avoid reloading to see changes
function addToRender(obj, type, id) {
	// Create HTML based on JSON
	const article = createArticle(obj, type, id);
	// Set and remove class with animation
	article.classList.add('loading-in');
	setTimeout(() => {
		article.classList.remove('loading-in');
	}, 1000);
	// Add HTML to DOM
	appendToList(article, obj);
}

// Remove JSON from render to avoid reloading
function removeFromRender(objId) {
	// Go through every HTML list (could be better, only go through the list it is in)
	for (const key in lists) {
		const list = lists[key];
		Array.from(list.children).forEach((listItem) => {
			if (listItem.dataset.id === objId) {
				list.removeChild(listItem);
			}
		});
	}
}

// Handle which list it gets appended to
function appendToList(html, jsonObj) {
	let type = html.dataset.type;
	if (type === 'resource') {
		html.querySelector('header').appendChild(createStackType(jsonObj));
	} else if (type === 'project') {
		// Set finished and not finished project type
		// !jsonObj.isCompleted doesn't work due to how JS evaluates null and undefined as false
		// Similar reasons prevent the use of a turnery
		if (jsonObj.isCompleted) { type = 'project-f'; }
		else if (jsonObj.isCompleted === false) { type = 'project-nf'; }
	}
	lists[type].appendChild(html);
}

//=== === === HANDLE EVENTS === === ===//

function openPage(event) {
	// Prevent the dropdown button & options from firing the event
	const elemClass = event.target.className;
	if (!(elemClass.includes('arrow') || elemClass.includes('option') || event.target.id === 'optionsList')) {
		require('electron').ipcRenderer.send(
			'open-box',
			`${this.dataset.type}, ${this.dataset.id}`
		);
	}
}

//=== === === CREATE DOM ELEMENTS === === ===//

// TODO: shorten the HTML generation code
function createArticle(getTextFor, type, id) {
	// Create article.box, set data attributes, and add @click listener
	const article = document.createElement('article');
	article.className = 'item';
	article.dataset.type = type;
	article.dataset.id = id;
	article.addEventListener('click', openPage);
	// Create header and append
	const header = document.createElement('header');
	article.appendChild(header);
	// Create h3 and append
	const h3 = document.createElement('h3');
	h3.textContent = getTextFor !== null || getTextFor !== "" ? getTextFor.name : 'Nothing Found';
	header.appendChild(h3);
	// Create div.content and append
	const content = document.createElement('div');
	content.className = 'content';
	article.appendChild(content);
	// create p.desc and append
	const desc = document.createElement('p');
	desc.className = 'desc';
	desc.textContent = getTextFor !== null || getTextFor !== "" ? getTextFor.desc : 'This section is empty';
	content.appendChild(desc);
	// create the conatiner to add the svg as a background to
	const svgContainer = document.createElement('button');
	svgContainer.className = 'arrow';
	const optionsElem = document.createElement('ul');
	optionsElem.id = 'optionsList';
	const options = ['Delete', 'Another One'];
	options.forEach((option) => {
		const optElem = document.createElement('li');
		optElem.className = 'option';
		optElem.textContent = option;
		// temporary for testing purposes
		optElem.addEventListener('click', () => {
			console.log('clonked');
			svgContainer.focus();
		});
		optionsElem.appendChild(optElem);
	});
	svgContainer.appendChild(optionsElem);
	article.appendChild(svgContainer);
	return article;
}

function createStackType(getTextFor) {
	// Create div.stack-type and append
	const stackType = document.createElement('div');
	stackType.className = `stack-type sub-header sh-bold`;
	// Create div.stack and append
	const stack = document.createElement('span');
	stack.className = 'stack';
	stack.textContent = `${getTextFor.stack} `;
	stackType.appendChild(stack);
	// Create div.type and append
	const type = document.createElement('span');
	type.className = 'type';
	type.textContent = getTextFor.type;
	stackType.appendChild(type);
	return stackType;
}

module.exports.addToRender = addToRender;
module.exports.removeFromRender = removeFromRender;
