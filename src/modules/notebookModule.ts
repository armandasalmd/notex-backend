import Notebook from '../models/Notebook'

import { tModuleRes } from '../types'

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
}
