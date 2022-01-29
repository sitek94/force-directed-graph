import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    paths: {
      base: isProd ? '/force-directed-graph' : undefined
    }
  }
}

export default config
