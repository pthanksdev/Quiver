import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({ plugins: [react()], build: { lib: { entry: resolve(__dirname, 'src/index.ts'), name: 'QuiverHardware', formats: ['es', 'cjs'], fileName: (f) => f === 'es' ? 'index.esm.js' : 'index.js' }, rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'], output: { globals: { react: 'React' } } }, sourcemap: false }, test: { environment: 'jsdom', globals: true } });
