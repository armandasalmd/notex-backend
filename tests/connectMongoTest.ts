import mongoose from 'mongoose'

export async function connect() {
	const mongooseOpts = {
		// options for mongoose 4.11.3 and above
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
	await mongoose.connect(process.env.MONGO_TEST_URI, mongooseOpts)

	// mongoose.connection.on('error', async e => {
	// 	if (e.message.code === 'ETIMEDOUT') {
	// 		console.log(e)
	// 		await mongoose.connect(process.env.MONGO_URI, mongooseOpts)
	// 	}
	// 	console.log(e)
	// })
}

export async function disconnect() {
	await mongoose.connection.close()
}

export async function clear() {
	const collections = mongoose.connection.collections
	// tslint:disable-next-line: forin
	for (const key in collections) {
		const collection = collections[key]
		await collection.deleteMany({})
	}
}

// /**
//  * Drop database, close the connection and stop mongod.
//  */
// const closeDatabase = async () => {
// 	await mongoose.connection.dropDatabase()
// 	await mongoose.connection.close()
// 	await mongod.stop()
// }

// https://www.theodinproject.com/courses/nodejs/lessons/testing-database-operations
