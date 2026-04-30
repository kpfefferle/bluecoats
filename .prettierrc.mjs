export default {
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.{js,ts,svelte,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
};
