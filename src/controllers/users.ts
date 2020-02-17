import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import validateRegisterInput from '../validation/register'
import validateLoginInput from '../validation/login'
import User from '../models/User' // Load User model

import { config } from 'dotenv'
config()
const JWT_SECRET = process.env.JWT_SECRET || 'no secret'
if (!process.env.JWT_SECRET)
	console.log('users.ts: JWT_SECRET is not set. Security issue!')

const router = express.Router()

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ email: 'Email already exists' })
		} else {
			const newUser = new User({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password
			})
			// Hash password before saving in database
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err2, hash) => {
					if (err2) throw err2
					newUser.password = hash
					newUser
						.save()
						.then(user2 => res.json(user2))
						.catch(err3 => console.log(err3))
				})
			})
		}
	})
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const email = req.body.email
	const password = req.body.password
	// Find user by email
	User.findOne({ email }).then(user => {
		// Check if user exists
		if (!user) {
			return res.status(404).json({ emailnotfound: 'Email not found' })
		}
		// Check password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					name: `${user.firstname} ${user.lastname}`
				}
				// Sign token
				jwt.sign(
					payload,
					JWT_SECRET,
					{
						expiresIn: 31556926 // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						})
					}
				)
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: 'Password incorrect' })
			}
		})
	})
})

export default router
