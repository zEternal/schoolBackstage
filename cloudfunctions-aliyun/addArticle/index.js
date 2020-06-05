'use slides'
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('slides')
	var res = await collection.add(event)
	return res
}
