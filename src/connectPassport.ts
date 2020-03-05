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
	secretOrKey: JWT_SECRET,
	passReqToCallback: true // <= Important, so that the verify function can accept the req param ie verify(req,payload,done)
}

const myPassport = (passport: any): void => {
	passport.use(
		new JwtStrategy(opts, (req: any, jwtPayload: any, done: any) => {
			User.findById(jwtPayload.id)
				.then(user => {
					if (user) {
						// req.user = jwtPaylaod
						req.user = user // <= Add this line
						return done(null, user)
					}
					return done(null, false)
				})
				.catch(err => console.log(err))
		})
	)
}

export default myPassport

/*
That is it: now any route that has the
passport.authenticate("jwt", {session: false})
middleware will receive req.user upon successful authentication.

https://stackoverflow.com/questions/40569492/passport-jwt-req-user-is-undefined-in-one-of-my-routes
*/
