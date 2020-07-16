export const createDb = (dbId) => {
	return `**/db/admin/${dbId}`
}

export const createGraph = (dbId, bid) => {
	if(!bid) bid = 'master'
	return `**/graph/admin/${dbId}/local/branch/${bid}/schema/main`
}


export const triplesGraph = (dbId, bid) => {
	if(!bid) bid = 'master'
	return `**/triples/admin/${dbId}/local/branch/${bid}/schema/main`
}


export const  woqlQuery = (dbId, bid) => {
	if(!bid) bid = 'master'
	return `**/woql/admin/${dbId}/local/branch/${bid}`
}

export const clone = (dbId) => {
	return `**/clone/admin/${dbId}`
}
