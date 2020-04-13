import { Notebook } from '../models'

import { Types } from 'mongoose'
import { tModuleRes } from '../types'

export default class NoteModule {
	async saveNote(
		email: string,
		noteId: string | Types.ObjectId,
		newText: string
	): Promise<tModuleRes> {
		const filter = { owner: email, 'notes._id': noteId }
		const update = { $set: { 'notes.$.text': newText } }
		return Notebook.updateOne(filter, update)
			.then((answer) => {
				if (answer.nModified === 0)
					return {
						error:
							'Error handling the request. Maybe you are not the author of this note?',
						status: 400,
					}
				else return { data: answer }
			})
			.catch(() => {
				return {
					status: 400,
					error: 'Error while updating the note text',
				}
			})
	}
}
