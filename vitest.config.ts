import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",  // LCOV report is supported by the 'v8' provider
      reporter: ["text", "lcov"],  // Generates the LCOV report
      // Optional: Specify the output directory for coverage
      reportsDirectory: "coverage" // (default: 'coverage')
    }
  },
});