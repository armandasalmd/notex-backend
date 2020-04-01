import NotebookModule from '../../src/modules/notebookModule'
import { tModuleRes, tNotebook, tNote, tUser } from '../../src/types'

/**
 * import setups
 */
import { generateNotebooksWithUsers } from '../__factory__/userFactory'
import { connect, disconnect, clear } from '../connectMongoTest'

describe('notebook module', () => {
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

	describe('getAllUserNotebooks()', () => {
		test('correct user', async () => {
			return generateNotebooksWithUsers()
				.then(() => {
					// Arrange
					const email = 'test@gmail.com'
					// Act
					const module = new NotebookModule()
					return module.getAllUserNotebooks(email)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).not.toHaveProperty('error')
					expect(res.data).toBeDefined()
					expect(res.data).toBeInstanceOf(Array)
					expect(res.data).toHaveLength(1)
				})
		})

		test('non existing user', async () => {
			return generateNotebooksWithUsers()
				.then(() => {
					// Arrange
					const email = 'nonexisting@gmail.com'
					// Act
					const module = new NotebookModule()
					return module.getAllUserNotebooks(email)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).not.toHaveProperty('error')
					expect(res.data).toBeDefined()
					expect(res.data).toBeInstanceOf(Array)
					expect(res.data).toHaveLength(0)
				})
		})
	})

	describe('addNewNotebook()', () => {
		test('correct call', async () => {
			return generateNotebooksWithUsers()
				.then(() => {
					// Arrange
					const title: string = 'Test title'
					const user: tUser = {
						firstname: 'Test',
						lastname: 'Torn',
						email: 'test@gmail.com'
					}
					// Act
					const module = new NotebookModule()
					return module.addNewNotebook(title, user)
				})
				.then((res: tModuleRes) => {
					// Assert
					expect(res).not.toHaveProperty('error')
					expect(res.data).toBeDefined()
					expect(res.data).toBeInstanceOf(Object)
					expect(res.data).toHaveProperty('_id')
					expect(res.data).toHaveProperty('notes')
					expect(res.data.title).toBe('Test title')
					expect(Object.keys(res.data).length).toBeGreaterThan(3)
					expect(res.data.notes.length).toBe(1)
					expect(res.data.notes[0].title).toBe('README')
				})
		})
	})
})
