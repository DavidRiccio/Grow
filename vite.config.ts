import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom', // Necesario para pruebas con el DOM
        setupFiles: './src/test/setup.js', // Archivo de configuración (opcional)
        globals: true, // Permite usar `describe`, `it`, etc., sin importar explícitamente
    },
});
