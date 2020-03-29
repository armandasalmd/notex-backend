import Note from './note'

export default interface tNotebook {
	_id: String
	title: String
	owner: String
	notes?: Array<Note>
}
