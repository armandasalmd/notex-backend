import { add } from '../../utils/math'

it('shoud add 1 + 2 to get 3', () => {
	expect(add(1, 2)).toBe(3)
})

it('shoud add 1 + 2 to be defined', () => {
	expect(add(1, 2)).toBeDefined()
})
