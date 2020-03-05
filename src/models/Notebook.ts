import { createSchema, Type, typedModel } from 'ts-mongoose'

const NotebookSchema = createSchema({
	title: Type.string({ required: true }),
	owner: Type.string({ required: true }),
	notes: [
		{
			title: Type.string({ required: true }),
			creationDate: Type.date({ default: Date.now as any }),
			text: Type.string({ default: '' }),
			accessLevel: Type.string({ default: 'private' })
		}
	]
})
// notes automaticaly gets objectId created

export default typedModel('notebook', NotebookSchema)
