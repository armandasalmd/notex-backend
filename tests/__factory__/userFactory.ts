import { User, Notebook } from '../../src/models'
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose'
import { tUser, tNotebook, tNote } from '../../src/types'

export async function generateMockUsers(): Promise<tUser[]> {
	const users = [
		{
			firstname: 'Test',
			lastname: 'Torn',
			email: 'test@gmail.com',
			password: 'test123',
		},
		{
			firstname: 'Mock',
			lastname: 'User',
			email: 'mock@gmail.com',
			password: 'test123',
		},
		{
			firstname: 'Tom',
			lastname: 'Turson',
			email: 'tom@gmail.com',
			password: 'test123',
		},
	]

	for (const element of users) {
		const salt = await bcrypt.genSalt(10)
		element.password = await bcrypt.hash(element.password, salt)
		await new User(element).save()
	}
	return users
}

export async function generateSingleNotebook(): Promise<tNotebook> {
	const date = new Date(Date.now())

	const notebook = new Notebook({
		title: 'Hello world notebook',
		owner: 'test@gmail.com',
		notes: [
			{
				title: 'Quick intro',
				creationDate: date,
				text: '### This is quick intro',
			},
			{
				title: 'Try to delete me',
				creationDate: date,
				text: 'Find a way to delete me :)',
			},
		],
	})
	await notebook.save()
	return JSON.parse(JSON.stringify(notebook))
}

export async function generateNotebooksWithUsers(): Promise<tNotebook[]> {
	await generateMockUsers()
	const date = new Date(Date.now())
	const notes: tNote[] = [
		{
			title: 'Quick intro',
			creationDate: date,
			text: '### This is quick intro',
		},
		{
			title: 'Try to delete me',
			creationDate: date,
			text: 'Find a way to delete me :)',
		},
	]
	const notebooks: tNotebook[] = [
		{
			title: 'Hello world notebook',
			owner: 'test@gmail.com',
			notes,
		},
		{
			title: 'Hello world notebook',
			owner: 'mock@gmail.com',
			notes,
		},
		{
			title: 'Hello world notebook',
			owner: 'tom@gmail.com',
			notes,
		},
	]
	for (const element of notebooks) {
		await new Notebook(element).save()
	}
	return notebooks
}
