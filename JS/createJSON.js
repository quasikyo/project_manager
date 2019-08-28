// @name 			the name
// @desc 			a description
// @resUsed 		an array with the IDs of the resources used
// @madWith 		an array with the IDs of the software used
// @isCompleted 	a boolean indicating if it is completed
function createProject(name, desc, resUsed, madeWith, isCompleted) {
	return {
		[computeID]: {
			name, desc, resUsed, madeWith, isCompleted
		}
	}
}

// @versions 	an array of the versions used
// @stack 		is it used on the frontend, backend, or both
// @type 		framework, library, toolkit
// @pUsed 		an array with the IDs with the projects that use this resource
// @sUsed 		an array with the IDs with the software that work with this resource
function createResource(name, desc, versions, stack, type, pUsed, sUsed) {
	return {
		[computeID]: {
			name, desc, versions, stack, type, pUsed, sUsed
		}
	}
}

// @type 			IDE, Editor, Design Tool, etc.
// @made 			an array with the IDs of the projects this software helped make
// @usedWithRes 	an array with the IDs of the resources this software works with
function createSoftware(name, desc, type, made, usedWithRes) {
	return {
		[computeID]: {
			name, desc, type, made, usedWithRes
		}
	}
}

// follows UUIDv4 standards
// original: https://stackoverflow.com/a/2117523 - the author tried to make it as compact as possible
// Uses bitwise operators (see more at developer.mozilla.org); this is either done to
// make it more compact, faster, or both. I do not know.
// This function replaces all the x's with a hex digit from 0-f, and the
// y is replaced with a hex digit from 8-b.
// To be honest, from what I've read, this is not the best implementation, but it's
// the only one I could understand.
function computeID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
		// Similar to Math.floor(Math.random() * 16) since the line below doesn't include decimals.
		// Since 0 in binary is 32 0s, the resulting number will always
		// have the binary, thus the value, of the randomly generated number.
		const randomNum = Math.random() * 16 | 0;
		// 0x[someHexNum] is hex notation (10 = 0xa, 3 = 0x3, 15 = 0xf).
		// If the char !== 'x', create a new number that has 1s where randomNum and 3 both have 1s
		// and then use that new number to create another number that has 1s where the new number has 1s
		// as well as where 8 has 1s.
		// This is done because of the 'y'.
		const v = char === 'x' ? randomNum : (randomNum & 0x3 | 0x8);
		// the 16 specifies the base, and base 16 is hex
		// converts the nubmer to a string whose letter is detemined by hex
		return v.toString(16);
	});
}