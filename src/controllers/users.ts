import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import validateRegisterInput from '../validation/register'
import validateLoginInput from '../validation/login'
import User from '../models/User' // Load User model
import { createSampleNotebook } from '../utils/notebook'

import userModule from '../modules/userModule'
import { tModuleRes } from '../types'

import { config } from 'dotenv'
config()
const JWT_SECRET = process.env.JWT_SECRET || 'no secret'
if (!process.env.JWT_SECRET)
	console.log('users.ts: JWT_SECRET is not set. Security issue!')

const router = express.Router()

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body)
	// Check validation
	if (!isValid) return res.status(400).json(errors)

	await new userModule()
		.register(req.body)
		.then((ans: tModuleRes) => {
			if (!ans.error) res.json({ data: ans.data })
			else if (ans.error === 'Email exists')
				res.status(ans.status).json({
					email: ans.error
				})
			else res.status(ans.status).json({ message: ans.error })
		})
		.catch(err => {
			if (process.env.NODE_ENV === 'development')
				res.status(500).json({ message: err.message })
			else res.status(500).json({ message: 'internal server error' })
		})
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', async (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body)
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	// Find user by email
	await new userModule()
		.login(req.body)
		.then((ans: tModuleRes) => {
			if (!ans.error) res.json(ans.data)
			else if (ans.error === 'Wrong password')
				res.status(ans.status).json({
					passwordincorrect: ans.error
				})
			else if (ans.error === 'Email not found')
				res.status(ans.status).json({ email: ans.error })
			else res.status(ans.status).json({ message: ans.error })
		})
		.catch(err => {
			if (process.env.NODE_ENV === 'development')
				res.status(500).json({ message: err.message })
			else res.status(500).json({ message: 'internal server error' })
		})
})

export default router
