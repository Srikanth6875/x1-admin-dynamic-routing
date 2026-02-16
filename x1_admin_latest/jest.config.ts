import type { Config } from "jest";

const baseTsJest = {
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
};

const config: Config = {
  projects: [
    {
      ...baseTsJest,
      displayName: "node",
      testEnvironment: "node",
      extensionsToTreatAsEsm: [".ts"],
      testMatch: ["**/?(*.)+(test|spec).ts"],
    },
    {
      ...baseTsJest,
      displayName: "js-dom",
      testEnvironment: "jsdom",
      extensionsToTreatAsEsm: [".ts", ".tsx"],
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      testMatch: ["**/?(*.)+(test|spec).tsx"],
    },
  ],

  //Coverage must be controlled ONLY here
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",

    //never measure tests
    "!app/**/*.test.{ts,tsx}",

    //settings / constants / enums
    "!app/**/settings.{ts,tsx}",
    "!app/shared/**",

    //app shell / router bootstrapping
    "!app/entry.client.tsx",
    "!app/entry.server.tsx",
    "!app/root.tsx",
    "!app/routes/**",
  ],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};

export default config;
