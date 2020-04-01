import UserModule from '../../src/modules/userModule'
import { tModuleRes, tLogin, tRegister } from '../../src/types'

/**
 * import setups
 */
import { generateMockUsers } from '../__factory__/userFactory'
import { connect, disconnect, clear } from '../connectMongoTest'

describe('user module', () => {
	/**
	 * Connect to a new in-memory database before running any tests.
	 */
	beforeAll(async () => await connect())

	/**
	 * Remove and close the db and server.
	 */
	afterAll(async () => await disconnect())

	/**
	 * Drop all collections in database
	 */
	afterEach(async () => await clear())

	describe('login()', () => {
		test('correct login', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user = {
						email: 'mock@gmail.com',
						password: 'test123'
					}
					const module = new UserModule()
					// Act
					return module.login(user)
				})
				.then((res: tModuleRes) => {
					const data: any = res.data
					// Assert
					expect(res).toBeDefined()
					expect(data).toHaveProperty('success')
					expect(data).toHaveProperty('token')
					expect(data.success).toBeTruthy()
					expect(data.token).toContain('Bearer')
				})
		})

		test('blank data passed', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user: tLogin = { email: '', password: '' }
					const module = new UserModule()
					// Act
					return module.login(user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('status')
					expect(res).toHaveProperty('error')
					expect(res).not.toHaveProperty('data')
					expect(res.status).toBe(404)
					expect(res.error).toContain('Email not found')
				})
		})

		test('blank password', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user: tLogin = {
						email: 'test@gmail.com',
						password: ''
					}
					const module = new UserModule()
					// Act
					return module.login(user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('status')
					expect(res).toHaveProperty('error')
					expect(res).not.toHaveProperty('data')
					expect(res.status).toBe(400)
					expect(res.error).toContain('Wrong password')
				})
		})
		test('wrong password', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user: tLogin = {
						email: 'test@gmail.com',
						password: 'asdasdasdasd'
					}
					const module = new UserModule()
					// Act
					return module.login(user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('status')
					expect(res).toHaveProperty('error')
					expect(res).not.toHaveProperty('data')
					expect(res.status).toBe(400)
					expect(res.error).toContain('Wrong password')
				})
		})

		test('non existing user', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user: tLogin = {
						email: 'nonexisting@gmail.com',
						password: 'asdasdasdasd'
					}
					const module = new UserModule()
					// Acts
					return module.login(user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('status')
					expect(res).toHaveProperty('error')
					expect(res).not.toHaveProperty('data')
					expect(res.status).toBe(404)
					expect(res.error).toContain('Email not found')
				})
		})
	})

	// TODO: get rid of generateMockUsers() as it is not needed to register
	describe('register()', () => {
		test('correct register', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					const user: tRegister = {
						firstname: 'Tedison',
						lastname: 'Larson',
						email: 'tedison@gmail.com',
						password: 'test123'
					}
					const module = new UserModule()
					// Act
					return module.register(user)
				})
				.then((res: tModuleRes) => {
					const data = res.data
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('data')
					expect(data).toHaveProperty('firstname')
					expect(data).toHaveProperty('lastname')
					expect(data).toHaveProperty('email')
					expect(data).toHaveProperty('password')
					expect(data).toHaveProperty('dateCreated')
				})
		})

		test('registering existing user', async () => {
			// Arrange
			return generateMockUsers()
				.then(() => {
					// test@gmail.com already exist: generateMockUsers()
					const user: tRegister = {
						firstname: 'Tedison',
						lastname: 'Larson',
						email: 'test@gmail.com',
						password: 'test123'
					}
					const module = new UserModule()
					// Act
					return module.register(user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).toBeDefined()
					expect(res).toHaveProperty('status')
					expect(res).toHaveProperty('error')
					expect(res).not.toHaveProperty('data')
					expect(res.status).toBe(400)
					expect(res.error).toContain('Email exists')
				})
		})
	})
})
