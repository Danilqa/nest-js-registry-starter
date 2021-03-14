module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main.ts',
        '!<rootDir>/src/environments/index.ts',
        '!<rootDir>/src/app.module.ts'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/libs/**/*.spec.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/jest/env-setup/check-assertions-number.ts'
    ],
    testURL: 'http://localhost',
    transform: {
        '^(?!.*\\.(js|ts|json)$)': '<rootDir>/config/jest/transform/file.transform.ts',
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'tsx',
        'web.js',
        'js',
        'json',
        'node'
    ],
    globals: {
        'ts-jest': { tsConfig: 'src/tsconfig.spec.json' }
    },
    collectCoverage: true
};
