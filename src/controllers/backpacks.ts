import express, { Response } from 'express'
import passport from 'passport'

import noteRouter from './notes'
import notebookRouter from './notebooks'
import NotebookModule from '../modules/notebookModule'
import { tNotebook, tModuleRes, tNote } from '../types'

const router = express.Router()

// GET BACKPACK: list of notebooks for auth user
// TODO: for testing purposes only!
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req: any, res: Response) => {
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
		const ans: tModuleRes = await new NotebookModule().getAllUserNotebooks(
			req.user.email
		)
		if (ans.error) {
			res.status(ans.status).json({ message: ans.error })
		} else {
			res.json(ans.data)
		}
	}
)

router.use(passport.authenticate('jwt', { session: false }), noteRouter)
router.use(passport.authenticate('jwt', { session: false }), notebookRouter)

export default router
