import { Notebook } from '../models'

import { tModuleRes, tUser } from '../types'

export default class NotebookModule {
	async getAllUserNotebooks(email: String): Promise<tModuleRes> {
		return Notebook.find({ owner: email })
			.then(notebooks => {
				if (!notebooks) return { data: [] }
				else return { data: JSON.parse(JSON.stringify(notebooks)) }
			})
			.catch(err => {
				return { status: 500, error: 'An error occured' }
			})
	}

	async addNewNotebook(title: string, user: tUser): Promise<tModuleRes> {
		return new Promise((resolve, reject) => {
			const note: any = {
				title: 'README',
				text: `### ${title}\n- Creation date: ${Date().toString()}\n- Author: ${
					user.firstname
				} ${user.lastname}`,
				creationDate: Date.now(),
				accessLevel: 'private'
			}
			const notebook = new Notebook()
			notebook.title = title
			notebook.owner = user.email
			notebook.notes = [note]
			notebook
				.save()
				.then(() => {
					resolve({ data: notebook })
				})
				.catch(err => {
					reject('cannot create a notebook')
				})
		})
	}
}
