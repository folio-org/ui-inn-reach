module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-private-methods', { 'loose': true }],
    ['@babel/plugin-transform-react-jsx', {
      'runtime': 'automatic'
    }],
    ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
  ],
};
