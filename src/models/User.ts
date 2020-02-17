import { createSchema, Type, typedModel } from 'ts-mongoose'

const UserSchema = createSchema({
	firstname: Type.string({ required: true }),
	lastname: Type.string({ required: true }),
	email: Type.string({ required: true }),
	password: Type.string({ required: true }),
	dateCreated: Type.date({ default: Date.now as any })
})

export default typedModel('user', UserSchema)
