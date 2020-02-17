import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import mongoose from 'mongoose'

const User = mongoose.model('user')

import { config } from 'dotenv'
config()
const JWT_SECRET = process.env.JWT_SECRET || 'no secret'
if (!process.env.JWT_SECRET)
	console.log('users.ts: JWT_SECRET is not set. Security issue!')

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET
}

const myPassport = (passport: any): void => {
	passport.use(
		new JwtStrategy(opts, (jwtPayload: any, done: any) => {
			User.findById(jwtPayload.id)
				.then(user => {
					if (user) {
						return done(null, user)
					}
					return done(null, false)
				})
				.catch(err => console.log(err))
		})
	)
}

export default myPassport
