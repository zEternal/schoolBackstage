'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const collection = db.collection('slides')
	var total = await collection.where({
		type: dbCmd.eq('meage')
	}).count()
	var res = await collection.where({
		type: dbCmd.eq('meage')
	}).field({
		'content': false
	}).orderBy('id_', 'desc').skip((event.page - 1) * event.limit).limit(event.limit).get()
	return {
		total: total.total,
		data: res.data
	}
}
