async function getJSON(type) {
	let resp;
	if (type === 'project') { resp = await fetch('../data/projects.json'); }
	else if (type === 'resource') { resp = await fetch('../data/resources.json'); }
	else if (type === 'software') { resp = await fetch('../data/software.json'); }
	else {
		console.error('Invalid renderJSON type. Accepted types are "project", "resource", "software".');
		return;
	}
	const data = await resp.json();
	return data;
}