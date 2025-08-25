import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kukipetsbo.com',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-BO',
        },
      },
    })
  ],
  // Añade esta nueva sección para Supabase
  vite: {
    define: {
      // Habilita el uso de import.meta.env
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
      // Polyfill para process.env (opcional pero recomendado)
      'process.env': {}
    },
    // Optimización para entornos SSR (opcional)
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  }
});