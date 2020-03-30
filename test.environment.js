const { MongoMemoryServer } = require('mongodb-memory-server')
const NodeEnvironment = require('jest-environment-node')

class TestEnvironment extends NodeEnvironment {
	mongoDb = new MongoMemoryServer({
		binary: { version: '4.2.3' },
		autoStart: false
	})

	async setup() {
		await super.setup()
		await this.mongoDb.start()

		this.global.process.env.MONGO_DB_URL = await this.mongoDb.getUri()
	}

	async teardown() {
		await super.teardown()
		await this.mongoDb.stop()

		this.mongoDb = null
	}
}

module.exports = TestEnvironment
