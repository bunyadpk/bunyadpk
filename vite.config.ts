import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { resolve as nodeResolve } from 'node:path';
import { createRequire } from 'node:module';

const req = createRequire(import.meta.url);

function resolvePkg(name: string): string {
  try {
    return nodeResolve(req.resolve(name));
  } catch {
    return name;
  }
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/bunyadpk/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'framer-motion': fileURLToPath(new URL('./src/lib/motion.tsx', import.meta.url)),
      'lucide-react': resolvePkg('lucide-react'),
      '@supabase/supabase-js': resolvePkg('@supabase/supabase-js'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react', '@supabase/supabase-js'],
    exclude: ['framer-motion'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
