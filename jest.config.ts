/* eslint-disable max-len */
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  bail: true,
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/*constants.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/.*\\.(ts|js)$'],
  coverageReporters: ['json', 'html', 'lcov'],
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vue/test-utils": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
    "radix-vue": "<rootDir>/node_modules/radix-vue/dist/radix-vue.cjs.js"
  },
  resetMocks: true,
  resetModules: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/tests/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: ['/.tmp/'],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.ts?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
};

export default config;
