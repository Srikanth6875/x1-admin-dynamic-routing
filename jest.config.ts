import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  clearMocks: true,

  coverageDirectory: "coverage", //Coverage output
  coverageReporters: ["text", "lcov", "html"],

  collectCoverageFrom: [  // ONLY measure business/app layer
    "app/x1-apps/**/*.ts",
    "!app/**/*.test.ts",
    "!app/**/settings.ts",
    "!app/**/settings.tsx",
  ],

  //Explicitly ignore framework & infra
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/build/",
    "/coverage/",
    "/app/clarity-admin/",
    "/app/database/",
    "/app/runner-engine/",
    "/app/shared-constants/",
    "/app/utils/",
    "/app/auth/",
  ],
};

export default config;
