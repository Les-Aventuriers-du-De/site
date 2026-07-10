// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? "https://les-aventuriers-du-de.github.io" : undefined,
  compressHTML: true,
  markdown: {
    syntaxHighlight: 'prism',
    processor: satteri({
      features: {
        gfm: true,
        smartPunctuation: true,
        math: true,
        frontmatter: true,
        subscript: true,
        superscript: true,
      },
    }),
  },
  scopedStyleStrategy: "where",
  // security: {
  //   csp: {
  //     algorithm: 'SHA-384',
  //     directives: [
  //       "connect-src 'self'",
  //       "default-src 'self'",
  //       "img-src 'self' data:",
  //       "font-src 'self'",
  //     ],
  //     scriptDirective: {
  //       resources: ["'self'"],
  //       strictDynamic: true,
  //       hashes: [],
  //     },
  //     styleDirective: {
  //       resources: ["'self'"],
  //       hashes: [
  //       ],
  //     },
  //   },
  // },
  vite: {
    build: {
      minify: false
    },
    css: {
      transformer: "postcss",
      postcss: {
        plugins: [
          autoprefixer(),
          cssnano({
            preset: "default",
          }),
        ],
      },
    }
  },
});
