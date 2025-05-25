module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@testing-library)", // Allow transformation of @testing-library packages
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  extensionsToTreatAsEsm: [".jsx"], // Removed .js, kept .jsx
};