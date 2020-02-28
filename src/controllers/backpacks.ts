import express from 'express'

import Notebook from '../models/Notebook'

const router = express.Router()

// TODO: for testing purposes only!
router.get('/', (req, res) => {
	Notebook.find({ owner: 'test@gmail.com' }).then(notebook => {
		if (!notebook) {
			return res.status(404).json({ message: 'Notebook not found' })
		}
		res.json(notebook)
	})
})

export default router
