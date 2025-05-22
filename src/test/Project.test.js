// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        'coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})

// package.json - Scripts section
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^22.0.0",
    "vitest": "^0.34.0",
    "@vitest/ui": "^0.34.0",
    "vue-router": "^4.0.0"
  }
}

// src/test/setup.js - Configuración global para tests
import { config } from '@vue/test-utils'

// Mock global para window.matchMedia (necesario para componentes responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock para IntersectionObserver (si usas lazy loading)
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Configuración global para Vue Test Utils
config.global.mocks = {
  $t: (msg) => msg, // Mock para i18n si lo usas
}

// Helper functions para tests
export const createMockRouter = (routes = []) => {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    getRoutes: () => routes,
    hasRoute: vi.fn(),
    resolve: vi.fn(),
    addRoute: vi.fn(),
    removeRoute: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        query: {},
        params: {},
        name: 'home',
        meta: {}
      }
    }
  }
}

export const createMockStore = (state = {}) => {
  return {
    state,
    commit: vi.fn(),
    dispatch: vi.fn(),
    getters: {}
  }
}