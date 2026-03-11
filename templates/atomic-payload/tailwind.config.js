/** @type {import('tailwindcss').Config} */

//This is purely to allow you to have tailwind intellisense when writing actual tailwind classes.
//It has 0 effect on the actual css. Which is handled by unocss.

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{html,vue,svelte,astro}'],
  corePlugins: { preflight: false },
}
