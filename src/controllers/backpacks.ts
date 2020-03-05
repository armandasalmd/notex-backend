import express from 'express'
import passport from 'passport'

import Notebook from '../models/Notebook'
import noteRouter from './notes'
import notebookRouter from './notebooks'

const router = express.Router()

// GET BACKPACK: list of notebooks for auth user
// TODO: for testing purposes only!
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req: any, res: express.Response) => {
		/* console.log(req.user)
		{
			_id: 5e49d533619c384ed83124e4,
			firstname: 'Armandas',
			lastname: 'Barkauskas',
			email: 'test@gmail.com',
			password: '$2a$10$uFUosXNI9TmjMhPN0fWbtu7KwJsQGd3yX1wHGdvcU9XGFTvR3iv3m',
			dateCreated: 2020-02-16T23:50:11.341Z,
			__v: 0
		}
		*/
		Notebook.find({ owner: req.user.email })
			.then(notebook => {
				if (!notebook) {
					return res
						.status(404)
						.json({ message: 'Notebook not found' })
				}
				res.json(notebook)
			})
			.catch(err => {
				res.status(500).json({ message: 'An error occured' })
			})
	}
)

router.use(passport.authenticate('jwt', { session: false }), noteRouter)
router.use(passport.authenticate('jwt', { session: false }), notebookRouter)

export default router
