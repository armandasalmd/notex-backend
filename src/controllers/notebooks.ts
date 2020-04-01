import express, { Response } from 'express'
import { Notebook } from '../models'

import { NotebookModule } from '../modules'
import { tUser, tModuleRes } from '../types'

const router = express.Router()

// ADD NEW NOTEBOOK
// Add new notebook: title, userId/email
router.post('/notebook/add', async (req: any, res: Response) => {
	if (req.body.title) {
		const user: tUser = {
			firstname: req.user.firstname,
			lastname: req.user.lastname,
			email: req.user.email
		}
		new NotebookModule()
			.addNewNotebook(req.body.title, user)
			.then((ans: tModuleRes) => {
				if (ans.error) {
					res.status(ans.status).json({ message: ans.error })
				} else {
					res.json(ans.data)
				}
			})
			.catch(() => {
				res.status(500).json({ message: 'server error' })
			})
	} else res.status(400).json('No req.body.title found')
})

// UPDATE NOTEBOOK
// Change notebook name: notebookId, auth, newName
router.put('/notebook/rename', (req: any, res: Response) => {
	if (req.body.notebookId && req.body.newName) {
		new NotebookModule()
			.renameNotebook(req.body.notebookId, req.body.newName)
			.then((ans: tModuleRes) => {
				if (ans.error) {
					res.status(ans.status).json({ message: ans.error })
				} else {
					res.json(ans.data)
				}
			})
			.catch(() => {
				res.status(500).json({ message: 'server error' })
			})
	} else
		res.status(400).json(
			'Incorrect body arguments. Wanted: notebookId, newName'
		)
})

// DELETE NOTEBOOK
// Delete notebook: notebookId, auth
router.delete('/notebook', (req: any, res: Response) => {
	if (req.body.notebookId) {
		Notebook.findByIdAndRemove(req.body.notebookId)
			.then(() =>
				res.json({ message: 'Successfully deleted', status: 200 })
			)
			.catch(() => {
				res.json({ message: 'Cannot delete', status: 400 })
			})
	} else res.status(400).json('No req.body.notebookId found')
})

export default router
