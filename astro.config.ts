// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD
    ? "https://les-aventuriers-du-de.github.io"
    : "http://localhost:4321",
  compressHTML: true,
  markdown: {
    syntaxHighlight: "prism",
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
  integrations: [
    sitemap({
      filter: (page) =>
        ["/drafts", "/admin"].every((path) => !page.includes(path)),
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "Français" },
      },
    }),
  ],
  scopedStyleStrategy: "attribute",
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
      minify: false,
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
    },
  },
});
