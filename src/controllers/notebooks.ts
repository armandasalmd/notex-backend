import express from 'express'

import Notebook from '../models/Notebook'

const router = express.Router()

// ADD NEW NOTEBOOK
// Add new notebook: name, userId/email
router.post('/notebook/add', (req: any, res) => {
	if (req.body.title) {
		const notebook = new Notebook()
		const note: any = {
			title: 'README',
			text: `### ${
				req.body.title
			}\n- Creation date: ${Date().toString()}\n- Author: ${
				req.user.firstname
			} ${req.user.lastname}`,
			creationDate: Date.now(),
			accessLevel: 'private'
		}
		notebook.title = req.body.title
		notebook.owner = req.user.email
		notebook.notes = [note]
		notebook
			.save()
			.then(() => res.json(notebook))
			.catch(err => {
				res.status(500).json({ message: 'cannot save new notebook' })
			})
	} else res.status(400).json('No req.body.title found')
})

// UPDATE NOTEBOOK
// Change notebook name: notebookId, auth, newName
router.put('/notebook/rename', (req: any, res) => {
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
router.delete('/notebook', (req, res) => {
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
