'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('slides')
	if (event.id instanceof Array) {
		for (let i = 0; i < event.id.length; i++) {
			await collection.doc(event.id[i]).remove()
		}
	} else {
		await collection.doc(event.id).remove()
	}
	return {
		status: 1,
		msg: '操作成功'
	}
};
