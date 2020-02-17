import { connection, connect } from 'mongoose'

import { config } from 'dotenv'
config()
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notex'
if (!process.env.MONGO_URI)
	console.log('Cannot find process.env.MONGO_URI. Using local database!')

try {
	const db = connection
	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', () => {
		// we're connected!
		console.log('Mongoose connected')
	})

	connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
} catch (err) {
	console.log('Mongo connection failed!')
}
