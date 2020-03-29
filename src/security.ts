import { Express } from 'express'
import rateLimit, { RateLimit } from 'express-rate-limit'
import helmet from 'helmet'

/**
 * Apply all security middlewares
 * @param app Main app object
 * @param enableTrustProxy Enable trust proxy
 */
const useSecurity = (app: Express, enableTrustProxy: Boolean = false) => {
	if (enableTrustProxy) app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
	useRateLimit(app)
	useHelmet(app)
}

/**
 * Apply rate limit middleware
 * @param app Main app object
 */
const useRateLimit = (app: Express) => {
	const limiter: RateLimit = rateLimit({
		windowMs: 10 * 60000, // 10 minutes
		max: 120, // 5 requests
		message: 'Too many requests made to the server. Try again later!'
	})
	app.use(limiter)
}

/**
 * Implements simple security middlewares
 * more can be found at this page:
 * https://www.npmjs.com/package/helmet
 * @param app Main app object
 */
const useHelmet = (app: Express) => {
	app.use(
		helmet({
			frameguard: false
		})
	)
}

export { useSecurity, useRateLimit, useHelmet }
