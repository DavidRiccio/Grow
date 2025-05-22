import { vi } from "vitest";

// Ejemplo de mock global
vi.mock("axios", () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

// Limpieza de mocks después de cada prueba
afterEach(() => {
  vi.clearAllMocks();
});
