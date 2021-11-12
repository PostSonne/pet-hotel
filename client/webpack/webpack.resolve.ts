import path from 'path';

export const getWebpackResolve = () => ({
  alias: {
    '@src': path.resolve(process.cwd(), './src'),
    '@assets': path.resolve(process.cwd(), './src/assets'),
    '@components': path.resolve(process.cwd(), './src/components'),
    '@containers': path.resolve(process.cwd(), './src/containers'),
    '@constants': path.resolve(process.cwd(), './src/constants'),
    '@core': path.resolve(process.cwd(), './src/core'),
    '@hooks': path.resolve(process.cwd(), './src/hooks'),
    '@redux': path.resolve(process.cwd(), './src/redux'),
    '@types': path.resolve(process.cwd(), './src/types'),
    '@utils': path.resolve(process.cwd(), './src/utils'),
    '@enums': path.resolve(process.cwd(), './src/enums')
  },
  extensions: ['.ts', '.tsx', '.js'],
  modules: [
    path.resolve(process.cwd(), './src'),
    path.resolve(process.cwd(), './node_modules')
  ]
});
