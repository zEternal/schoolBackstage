'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('slides')
	const res = await collection.doc(event.id).get()
	return res
}
;
