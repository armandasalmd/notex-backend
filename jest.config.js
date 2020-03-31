module.exports = {
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
	// testRegex: '.spec.ts$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	coverageDirectory: './coverage',
	collectCoverageFrom: ['src/**/*.ts', '!src/models/**', '!src/types'],
	testEnvironment: './test.environment'
}
