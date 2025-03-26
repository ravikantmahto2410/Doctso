import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/server.js',  // Change this to your actual entry file
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [commonjs()]
};