/**
 * import types
 */
import { tNote, tNotebook } from '../types'

/**
 * Return Note object taken from notebook
 * @param document Notebook object
 * @param noteId String format ID
 */
export function extractNoteFromDocument(
	document: tNotebook,
	noteId: String
): tNote {
	const filteredDoc = document.notes.filter(
		note => note._id.toString() === noteId
	)
	if (filteredDoc.length === 1) {
		return filteredDoc[0]
	} else {
		throw new Error(
			`Could not extract Note. Elements found: ${filteredDoc.length} instead of 1`
		)
	}
}
