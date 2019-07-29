function createProject(id, name, desc, resUsed, madeWith, status) {
	return {
		[id]: {
			"name": name,
			"desc": desc,
			"resUsed": resUsed,
			"madeWith": madeWith,
			"status": status
		}
	}
}

function createResource(id, name, desc, versions, stack, type, pUsed, sUsed) {
	return {
		[id]: {
			"name": name,
			"desc": desc,
			"versions": versions,
			"stack": stack,
			"type": type,
			"pUsed": pUsed,
			"sUsed": sUsed
		}
	}
}

function createSoftware(id, name, desc, type, made, usedWithRes) {
	return {
		[id]: {
			"name": name,
			"desc": desc,
			"type": type,
			"made": made,
			"usedWithRes": usedWithRes
		}
	}
}