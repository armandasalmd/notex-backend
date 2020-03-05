import express from 'express'

import Notebook from '../models/Notebook'

const router = express.Router()

// PUT NOTE TO OTHER NOTEBOOK
// changeNotebook: noteId, newNnotebookId, auth
router.put('/note/changeNotebook', (req, res) => {
	res.send('changeNotebook: noteId, newNnotebookId, auth')
})

// SAVE NOTE TEXT
// save text for note: noteId, auth, newText
router.post('/note/save', (req, res) => {
	res.send('save text for note: noteId, auth, newText')
})

// UPDATE NOTE NAME
// Change note name: notebookId, auth, newName
router.put('/note/rename', (req, res) => {
	res.send('Change notebook name: notebookId, auth, newName')
})

// DELETE NOTE
// Delete note: noteId, auth
router.delete('/note', (req, res) => {
	res.send('Delete notebook: notebookId, auth')
})

// ADD NEW NOTE
// Add new note: name, userId/email
router.post('/note/add', (req, res) => {
	res.send('Add new notebook: name, userId/email')
})

// CHANGE NOTE ACCESS LEVEL
// Change access level public/private: auth, noteId, accessLevel
router.put('/note/accessLevel', (req, res) => {
	res.send('Change access level public/private: auth, noteId, accessLevel')
})

export default router
