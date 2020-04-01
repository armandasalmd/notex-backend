import NotebookModule from '../../src/modules/notebookModule'
import { tModuleRes, tNotebook, tNote, tUser } from '../../src/types'
import { Notebook } from '../../src/models'

/**
 * import setups
 */
import {
	generateNotebooksWithUsers,
	generateMockUsers
} from '../__factory__/userFactory'
import { connect, disconnect, clear } from '../connectMongoTest'
import { Types } from 'mongoose'

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

		test('adding duplicate', async () => {
			return generateNotebooksWithUsers()
				.then(() => {
					// Arrange
					const title: string = 'Hello world notebook'
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
					expect(res.error).toBe('Notebook with this name exists')
					expect(res.status).toBe(400)
				})
		})
	})

	describe('renameNotebook()', () => {
		test('valid renaming', async () => {
			return generateMockUsers()
				.then(() => {
					// Arrange
					const notebook = new Notebook({
						title: 'Hello world notebook',
						owner: 'test@gmail.com',
						notes: {
							title: 'Quick intro',
							createDate: Date.now(),
							text: '### This is quick intro'
						}
					})
					return notebook.save()
				})
				.then(notebook => {
					// Act
					const module = new NotebookModule()
					const id: Types.ObjectId = notebook._id
					return module.renameNotebook(
						id.toHexString(),
						'New notebook name'
					)
				})
				.then((ans: tModuleRes) => {
					// Assert
					expect(ans).not.toHaveProperty('error')
					expect(ans.data).toHaveProperty('_id')
					expect(ans.data).toHaveProperty('notes')
					expect(ans.data.title).toBe('New notebook name')
				})
		})

		test('nonexisting renaming', async () => {
			return generateMockUsers()
				.then(() => {
					// Arrange
					const notebook = new Notebook({
						title: 'Hello world notebook',
						owner: 'test@gmail.com',
						notes: {
							title: 'Quick intro',
							createDate: Date.now(),
							text: '### This is quick intro'
						}
					})
					return notebook.save()
				})
				.then(() => {
					// Act
					const module = new NotebookModule()
					const id = Types.ObjectId()
					return module.renameNotebook(
						id.toHexString(),
						'New notebook name'
					)
				})
				.then((ans: tModuleRes) => {
					// Assert
					expect(ans.status).toEqual(500)
					expect(ans.error).toEqual('Cannot rename your notebook')
				})
		})
	})

	describe('deleteNotebook()', () => {
		test('valid arguments', async () => {
			return generateMockUsers()
				.then(() => {
					// Arange
					const notebook = new Notebook({
						title: 'Hello world notebook',
						owner: 'test@gmail.com',
						notes: {
							title: 'Quick intro',
							createDate: Date.now(),
							text: '### This is quick intro'
						}
					})
					return notebook.save()
				})
				.then(notebook => {
					// Act
					const module = new NotebookModule()
					const id: Types.ObjectId = notebook._id
					return module.deleteNotebook(id)
				})
				.then((ans: tModuleRes) => {
					// Assert
					expect(ans).not.toHaveProperty('error')
					expect(ans.data).toHaveProperty('_id')
					expect(ans.data).toHaveProperty('notes')
					expect(ans.data.title).toBe('Hello world notebook')
					expect(ans.data.owner).toBe('test@gmail.com')
				})
		})

		test('nonexisting notebook', async () => {
			return generateMockUsers()
				.then(() => {
					// Act
					const module = new NotebookModule()
					const id = Types.ObjectId() // random id
					return module.deleteNotebook(id)
				})
				.then((ans: tModuleRes) => {
					// Assert
					expect(ans.error).toBeDefined()
					expect(ans.status).toBe(400)
				})
		})
	})
})
