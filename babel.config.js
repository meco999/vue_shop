module.exports = {
  env: {
    development: {
      sourceMaps: true,
      retainLines: true
    }
  },
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
