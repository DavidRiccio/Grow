// src/test/setup.js
import "whatwg-fetch"; // Polyfill para fetch si es necesario
import { vi } from "vitest";
import { vi } from "vitest";
import { config } from "@vue/test-utils";

const wrapper = mount(HomeView, {
  global: {
    components: {
      "router-link": {
        template: "<a><slot /></a>", // Mock básico de router-link
      },
    },
  },
});

// Mock global de librerías o funcionalidades
vi.mock("axios", () => ({
  get: vi.fn(),
  post: vi.fn(),
}));
afterEach(() => {
  vi.clearAllMocks(); // Limpia todos los mocks después de cada prueba
});
