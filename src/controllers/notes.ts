import express from 'express'
import { extractNoteFromDocument } from '../utils/note'
import { toNotebook } from '../utils/notebook'

/**
 * import models
 */
import Notebook from '../models/Notebook'

/**
 * import types
 */
import { tNotebook, tNote } from '../types'

const router = express.Router()

// TODO: implement this later
// PUT NOTE TO OTHER NOTEBOOK
// changeNotebook: noteId, newNotebookId, auth
router.put('/note/changeNotebook', async (req: any, res) => {
	if (req.body.noteId && req.body.newNotebookId) {
		// TASK 1: take out the entry from old notebook
		let filter: any = {
			owner: req.user.email,
			'notes._id': req.body.noteId
		}
		let notebook: any = await Notebook.findOne(filter)
		// takes out the target note
		let targetNote = {}

		notebook.notes = notebook.notes.filter((note: any) => {
			// saves the note that is going to be removed(filtered)
			// tslint:disable-next-line
			const equal = note._id != req.body.noteId
			if (!equal) targetNote = note
			return equal
		})
		notebook
			.save()
			.then(async () => {
				// TASK 2: save the note to the new notebook
				// insert variable targetNote into newNotebookId
				filter = { owner: req.user.email, _id: req.body.newNotebookId }
				notebook = await Notebook.findOne(filter)
				if (notebook) {
					notebook.notes.push(targetNote)
					notebook
						.save()
						.then(answer => res.json(answer))
						.catch(() => {
							res.status(400).json({
								message: 'Error: cannot transfer the note'
							})
						})
				} else
					res.status(400).json({
						message: 'Error: newNotebookId was not found'
					})
			})
			.catch(err =>
				res.status(500).json({
					message: 'Note cannot be removed from old notebook'
				})
			)
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: noteId, newNotebookId'
		})
})

// SAVE NOTE TEXT
// save text for note: noteId, auth, newText
router.put('/note/save', (req: any, res) => {
	if (req.body.noteId && req.body.newText) {
		const filter = { owner: req.user.email, 'notes._id': req.body.noteId }
		const update = { $set: { 'notes.$.text': req.body.newText } }
		Notebook.updateOne(filter, update)
			.then(answer => {
				// if nUpdated = 0, throw error
				// you can only update notes that you own!
				if (answer.nModified === 0)
					res.status(400).json({
						message:
							'Error handling the request. Maybe you are not the author of this note?'
					})
				else res.json(answer)
			})
			.catch(err => {
				res.status(400).json({
					message: 'Error while saving the note text'
				})
			})
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: noteId, newText'
		})
})

// UPDATE NOTE NAME
// Change note name: noteId, auth, newName
router.put('/note/rename', (req: any, res) => {
	if (req.body.noteId && req.body.newName) {
		const filter = { owner: req.user.email, 'notes._id': req.body.noteId }
		const update = { $set: { 'notes.$.title': req.body.newName } }
		Notebook.updateOne(filter, update)
			.then(answer => {
				// if nUpdated = 0, throw error
				// you can only update notes that you own!
				if (answer.nModified === 0)
					res.status(400).json({
						message:
							'Error handling the request. Maybe you are not the author of this note?'
					})
				else res.json(answer)
			})
			.catch(err => {
				res.status(400).json({
					message: 'Error while saving new name'
				})
			})
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: noteId, newName'
		})
})

// DELETE NOTE
// Delete note: noteId, auth
router.delete('/note', (req: any, res) => {
	if (req.body.noteId) {
		const filter = { owner: req.user.email, 'notes._id': req.body.noteId }
		const update = { $pull: { notes: { _id: req.body.noteId } } }
		Notebook.findOneAndUpdate(filter, update).then(answer => {
			// turning Document type to Object/tNotebook type
			const document: tNotebook = toNotebook(answer)
			if (!document)
				res.status(400).json({
					message:
						'Error handling the request. Maybe you are not the author of this note?'
				})
			else {
				try {
					res.json(extractNoteFromDocument(document, req.body.noteId))
				} catch (error) {
					res.status(500).json({
						message: 'Server error',
						status: 500
					})
				}
			}
		})
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: noteId'
		})
})

// ADD NEW NOTE
// Add new note: name, notebookId, ?accessLevel userId/email
router.post('/note/add', (req: any, res) => {
	if (req.body.name && req.body.notebookId) {
		const filter = { owner: req.user.email, _id: req.body.notebookId }
		Notebook.findOne(filter).then(notebook => {
			if (notebook) {
				const newNote: any = {
					title: req.body.name,
					text: `### ${req.body.name}`
				}
				// if accessLevel was provided and is valid - use it
				if (['public', 'private'].includes(req.body.accessLevel))
					newNote.accessLevel = req.body.accessLevel
				notebook.notes.push(newNote)
				notebook
					.save()
					.then(asnwer =>
						res.json(notebook.notes[notebook.notes.length - 1])
					)
					.catch(err => {
						res.status(500).json({
							message: 'Error. Cannot save new note'
						})
					})
			} else {
				res.status(400).json({
					message: 'Error. Cannot add new note. Check the arguments'
				})
			}
		})
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: name, notebookId'
		})
})

// CHANGE NOTE ACCESS LEVEL
// Change access level public/private: auth, noteId, accessLevel
router.put('/note/accessLevel', (req: any, res) => {
	if (req.body.accessLevel && req.body.noteId) {
		if (['public', 'private'].includes(req.body.accessLevel)) {
			const filter = {
				owner: req.user.email,
				'notes._id': req.body.noteId
			}
			const update = {
				$set: { 'notes.$.accessLevel': req.body.accessLevel }
			}
			Notebook.findOneAndUpdate(filter, update)
				.then(answer => {
					if (!answer)
						res.status(400).json({
							message: 'Error. Note was not found in database'
						})
					const document: tNotebook = toNotebook(answer)

					try {
						res.json({
							...extractNoteFromDocument(
								document,
								req.body.noteId
							),
							accessLevel: req.body.accessLevel
						})
					} catch (err) {
						res.status(500).json({
							message: 'Server error occured!',
							status: 500
						})
					}
				})
				.catch(err => {
					res.status(400).json({
						message:
							"Error when updating. Maybe you don't have rights?"
					})
				})
		} else
			res.status(400).json({
				message: 'Error. AccessLevel can only be public or private'
			})
	} else
		res.status(400).json({
			message: 'Incorrect body arguments. Wanted: noteId, accessLevel'
		})
})

export default router
