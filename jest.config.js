module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\spec.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '<rootDir>/packages/*/node_modules/',
        '<rootDir>/node_modules/'
    ],
};