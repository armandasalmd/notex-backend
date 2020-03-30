import validator, {
	RegisterData,
	RegisterErrors
} from '../../validation/register'

describe('testing register validator', () => {
	const basicForm: RegisterData = {
		firstname: 'Test',
		lastname: 'Torn',
		email: 'test@gmail.com',
		password: 'test123',
		password2: 'test123'
	}
	test('empty objects', () => {
		const res = validator(undefined)
		expect(res.isValid).toBeFalsy()
		// response must have 5 object properties
		expect(Object.keys(res.errors).length).toBe(5)
	})

	test('empty name', () => {
		const res = validator({ ...basicForm, firstname: '' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('firstname')
	})

	test('empty surname', () => {
		const res = validator({ ...basicForm, lastname: '' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('lastname')
	})

	test('empty email', () => {
		const res = validator({ ...basicForm, email: '' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('email')
	})

	test('short password', () => {
		const res = validator({ ...basicForm, password: 'short' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('password')
		expect(res.errors).toHaveProperty('password2')
	})

	test('differenct passwords 1/2', () => {
		const res = validator({ ...basicForm, password2: 'testWrong' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('password2')
	})

	test('invalid email', () => {
		const res = validator({ ...basicForm, email: 'invalid@' })
		expect(res.isValid).toBeFalsy()
		expect(res.errors).toHaveProperty('email')
	})
})
