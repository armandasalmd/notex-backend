import { Notebook } from '../models'

import { tModuleRes, tUser } from '../types'
import { Types } from 'mongoose'
import { toNotebook } from '../utils/notebook'

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
		return Notebook.findOne({ title, owner: user.email })
			.then(async match => {
				if (match) {
					// notebook exists for user.email
					return {
						status: 400,
						error: 'Notebook with this name exists'
					}
				} else {
					// there is no notebook with the same name for user user.email
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
					await notebook.save()
					return { data: notebook }
				}
			})
			.then((ans: tModuleRes) => {
				return ans
			})
			.catch(err => {
				return {
					status: 500,
					error: 'cannot create a notebook'
				}
			})
	}

	async renameNotebook(
		notebookId: string | Types.ObjectId,
		newName: string
	): Promise<tModuleRes> {
		return Notebook.findOne({ _id: notebookId })
			.then(async notebook => {
				notebook.title = newName // mongooose returns old instance
				await notebook.save()
				return { data: notebook }
			})
			.catch(() => {
				return { status: 500, error: 'Cannot rename your notebook' }
			})
	}

	async deleteNotebook(notebookId: string | Types.ObjectId): Promise<any> {
		return Notebook.findById(notebookId)
			.then(async notebook => {
				return notebook.remove()
			})
			.then(notebook => {
				return { data: toNotebook(notebook) }
			})
			.catch(() => {
				return { status: 400, error: 'Notebook doesnt exist' }
			})
	}
}
