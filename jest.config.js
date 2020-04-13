module.exports = {
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '/tests/.*(test|spec).tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	coverageDirectory: './coverage',
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/models/**',
		'!src/types',
		'!src/*.ts',
		'!src/types/*',
		'!**/index.ts'
	],
	testEnvironment: './test.environment'
}
