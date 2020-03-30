import Validator from 'validator'
import isEmpty from 'is-empty'

interface LoginData {
	email: string
	password: string
}

interface LoginErrors {
	errors: object
	isValid: boolean
}

// tslint:disable-next-line: ban-types
const validateLoginInput = (data: LoginData): LoginErrors => {
	if (!data) {
		data = { email: '', password: '' }
	}
	const errors: any = {}
	// Convert empty fields to an empty string so we can use validator functions
	data.email = !isEmpty(data?.email) ? data.email : ''
	data.password = !isEmpty(data?.password) ? data.password : ''

	// Email checks
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	} else if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}
	// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}
	return {
		errors,
		isValid: isEmpty(errors)
	}
}

export default validateLoginInput

export { LoginData, LoginErrors }
