// import NotebookModule from '../../src/modules/notebookModule'
// import { tModuleRes, tNotebook, tNote, tUser } from '../../src/types'
// import { Notebook } from '../../src/models'
// import { connect, disconnect, clear } from '../connectMongoTest'
// import { Types } from 'mongoose'
// import { generateSingleNotebook } from '../__factory__/userFactory'

// describe('note module', () => {
// 	/**
// 	 * Connect to a new in-memory database before running any tests.
// 	 */
// 	beforeAll(async () => await connect())

// 	/**
// 	 * Remove and close the db and server.
// 	 */
// 	afterAll(async () => await disconnect())

// 	/**
// 	 * Drop all collections in database
// 	 */
// 	afterEach(async () => await clear())

// 	describe('saveNote()', () => {
// 		test('correct details', async () => {
// 			return generateSingleNotebook().then((data) => {})
// 		})

// 		test('set other user note results in error', async () => {})

// 		test('empty text passed', async () => {})

// 		test('saving existing test', async () => {})
// 	})
// })
