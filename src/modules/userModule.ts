import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * import local modules
 */
import { tLogin, tRegister } from '../types'
import User from '../models/User' // Load User model
import { createSampleNotebook } from '../utils/notebook'
import { tModuleRes } from '../types'

/**
 * import environment
 */
import { config } from 'dotenv'
config()
const JWT_SECRET = process.env.JWT_SECRET || 'no secret'

export default class UserModule {
	async register(body: tRegister): Promise<tModuleRes> {
		return User.findOne({ email: body.email })
			.then(async user => {
				if (user) {
					return { status: 400, error: 'Email exists' }
				} else {
					const newUser = new User({
						firstname: body.firstname,
						lastname: body.lastname,
						email: body.email,
						password: body.password
					})

					const salt = await bcrypt.genSalt(10)
					const hash = await bcrypt.hash(newUser.password, salt)
					newUser.password = hash
					createSampleNotebook(newUser.email)
					return newUser.save()
				}
			})
			.then((user2: any) => {
				if (user2.error) return user2
				else return { data: user2 } // bundle user data under "data"
			})
	}

	async login(body: tLogin): Promise<tModuleRes> {
		const user = await User.findOne({ email: body.email })
		// Check if user exists
		if (!user) {
			return { status: 404, error: 'Email not found' }
		}
		// Check password
		const isMatch = await bcrypt.compare(body.password, user.password)
		if (isMatch) {
			// User matched
			// Create JWT Payload
			const payload = {
				id: user.id,
				firstname: user.firstname,
				lastname: user.lastname,
				name: `${user.firstname} ${user.lastname}`
			}

			const token = jwt.sign(payload, JWT_SECRET, {
				expiresIn: 31556926 // 1 year in seconds
			})
			return {
				data: {
					success: true,
					token: 'Bearer ' + token
				}
			}
		} else {
			return { status: 400, error: 'Wrong password' }
		}
	}
}
