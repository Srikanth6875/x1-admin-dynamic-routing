import type { Config } from "jest";

const baseTsJest = {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { useESM: true, tsconfig: "tsconfig.json" },
    ],
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
    "!app/shared-constants/**",

    //framework & infra
    "!app/clarity-admin/freame-work/**",
    "!app/database/**",
    "!app/utils/**",
    "!app/server/**",

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
