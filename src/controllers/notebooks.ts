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
		await new NotebookModule()
			.addNewNotebook(req.body.title, user)
			.then((ans: tModuleRes) => {
				if (ans.error) {
					res.status(ans.status).json({ message: ans.error })
				} else {
					res.json(ans.data)
				}
			})
			.catch(err => {
				res.status(500).json({ message: 'server error' })
			})
	} else res.status(400).json('No req.body.title found')
})

// UPDATE NOTEBOOK
// Change notebook name: notebookId, auth, newName
router.put('/notebook/rename', (req: any, res: Response) => {
	if (req.body.notebookId && req.body.newName) {
		const filter = { _id: req.body.notebookId }
		const update = { title: req.body.newName }
		Notebook.findOneAndUpdate(filter, update)
			.then(notebook => {
				notebook.title = req.body.newName // mongooose returns old instance
				res.json(notebook)
			})
			.catch(err => {
				res.status(500).json({
					message: 'cannot save update notebook name'
				})
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
			.catch(err => {
				res.json({ message: 'Cannot delete', status: 400 })
			})
	} else res.status(400).json('No req.body.notebookId found')
})

export default router
