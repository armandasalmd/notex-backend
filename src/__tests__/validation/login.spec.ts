import validator, { LoginData, LoginErrors } from '../../validation/login'

describe('Testing validator function', () => {
	describe('passing empty arguments', () => {
		test('passing empty login data', () => {
			const data: LoginData = { email: '', password: '' }
			const res: LoginErrors = validator(data)
			expect(res.isValid).toBeFalsy()

			const errors = {
				email: 'Email field is required',
				password: 'Password field is required'
			}
			expect(res.errors).toEqual(errors)
		})

		test('passing undefined', () => {
			expect(validator(undefined).isValid).toBeFalsy()
		})
	})

	describe('passing invalid emails', () => {
		test('email as a word', () => {
			const data: LoginData = {
				email: 'invalidEmail',
				password: 'test123'
			}

			expect(validator(data).isValid).toBeFalsy()
			expect(validator(data).errors).toHaveProperty('email')
			expect(validator(data).errors).not.toHaveProperty('password')
		})

		test('email ending with @', () => {
			const data: LoginData = {
				email: 'invalidEmail@',
				password: 'test123'
			}

			expect(validator(data).isValid).toBeFalsy()
			expect(validator(data).errors).toHaveProperty('email')
			expect(validator(data).errors).not.toHaveProperty('password')
		})

		test('email starting with @', () => {
			const data: LoginData = {
				email: '@invalidEmail',
				password: 'test123'
			}

			expect(validator(data).isValid).toBeFalsy()
			expect(validator(data).errors).toHaveProperty('email')
			expect(validator(data).errors).not.toHaveProperty('password')
		})

		test('email without .domain', () => {
			const data: LoginData = {
				email: 'asdasd@invalidEmail',
				password: 'test123'
			}

			expect(validator(data).isValid).toBeFalsy()
			expect(validator(data).errors).toHaveProperty('email')
			expect(validator(data).errors).not.toHaveProperty('password')
		})
	})

	test('passing correct emails', () => {
		const data: LoginData[] = [
			{
				email: 'test@gmail.com',
				password: 'test123'
			},
			{
				email: 'test@coventry.ac.uk',
				password: 'test123'
			},
			{
				email: 'test@hotmail.com',
				password: 'test123'
			}
		]

		data.forEach((loginData: LoginData) => {
			expect(validator(loginData).isValid).toBeTruthy()
			expect(validator(loginData).errors).toEqual({})
		})
	})

	describe('passing incorrect password', () => {
		test('passing no password', () => {
			const data: LoginData = { email: 'test@gmail.com', password: '' }
			const res: LoginErrors = validator(data)
			expect(res.isValid).toBeFalsy()
			expect(res.errors).toHaveProperty('password')
			expect(res.errors).not.toHaveProperty('email')
		})
	})
})
