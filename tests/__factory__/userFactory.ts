import { User, Notebook } from '../../src/models'
import bcrypt from 'bcryptjs'

export async function generateMockUsers() {
	const users = [
		{
			firstname: 'Test',
			lastname: 'Torn',
			email: 'test@gmail.com',
			password: 'test123'
		},
		{
			firstname: 'Mock',
			lastname: 'User',
			email: 'mock@gmail.com',
			password: 'test123'
		},
		{
			firstname: 'Tom',
			lastname: 'Turson',
			email: 'tom@gmail.com',
			password: 'test123'
		}
	]

	for (const element of users) {
		const salt = await bcrypt.genSalt(10)
		element.password = await bcrypt.hash(element.password, salt)
		await new User(element).save()
	}
	// console.log((await User.find({})).length)
}

export async function generateNotebooksWithUsers() {
	await generateMockUsers()
	const date = Date.now()
	const notes = [
		{
			title: 'Quick intro',
			createDate: date,
			text: '### This is quick intro'
		},
		{
			title: 'Try to delete me',
			createDate: date,
			text: 'Find a way to delete me :)'
		}
	]
	const notebooks = [
		{
			title: 'Hello world notebook',
			owner: 'test@gmail.com',
			notes
		},
		{
			title: 'Hello world notebook',
			owner: 'mock@gmail.com',
			notes
		},
		{
			title: 'Hello world notebook',
			owner: 'tom@gmail.com',
			notes
		}
	]
	for (const element of notebooks) {
		await new Notebook(element).save()
	}
}
