module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
}
