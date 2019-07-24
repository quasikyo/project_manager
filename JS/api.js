export async function getProjects() {
	const resp = await fetch('./data/projects.json');
	const data = await resp.json();
	return data;
}

export async function getProject(id) {
	const data = await getProjects();
	return data[id];
}

export async function getResources() {
	const resp = await fetch('./data/resources.json');
	const data = await resp.json();
	return data;
}

export async function getResource(id) {
	const data = await getResources();
	return data[id];
}

// Not really an api function, but no way in hell am I typing document.createElement('...') every time.
export function createElem(elem) {
	return document.createElement(elem);
}