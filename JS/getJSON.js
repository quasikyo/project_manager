async function getJSON(type) {
	const resp = await fetch(`../data/${type}.json`);
	const data = await resp.json();
	return data;
}

module.exports = getJSON;
