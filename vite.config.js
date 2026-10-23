import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Inlines the built stylesheet into index.html so the first paint doesn't wait on a
// separate CSS request. Fine here because the whole stylesheet is only about 4 KiB.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx && ctx.bundle
        if (!bundle) return html
        return html.replace(
          /<link rel="stylesheet"[^>]*?href="([^"]+\.css)"[^>]*?>/g,
          (tag, href) => {
            const file = bundle[href.replace(/^\//, '')]
            if (!file || file.type !== 'asset') return tag
            const css =
              typeof file.source === 'string'
                ? file.source
                : Buffer.from(file.source).toString('utf8')
            return `<style>${css}</style>`
          },
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineCss()],
})