import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      all: false,
      // Only enforce coverage on the modules that have tests. As the suite
      // grows, add more globs here (or widen to `src/**`) and the 80% gate
      // applies to them automatically.
      include: [
        'src/functions/**',
        'src/lib/**',
        'src/hooks/useInterval.ts',
        'src/hooks/useWindow.ts',
        'src/hooks/useDetectOutsideClick.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
