import User from '../../src/models/User'
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
