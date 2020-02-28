import Notebook from '../models/Notebook'

export function createSampleNotebook(userEmail: String) {
	const sampleNotebook = new Notebook({
		title: 'Hello world notebook',
		owner: userEmail,
		notes: [
			{
				title: 'Quick intro',
				createDate: Date.now(),
				text: '### This is quick intro'
			},
			{
				title: 'Try to delete me',
				createDate: Date.now(),
				text: 'Find a way to delete me :)'
			}
		]
	})
	sampleNotebook.save()
}
