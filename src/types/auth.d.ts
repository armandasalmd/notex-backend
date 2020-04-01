export interface tLogin {
	_id?: string
	email: string
	password: string
}

export interface tRegister extends tLogin {
	firstname: string
	lastname: string
	password2?: string
}
