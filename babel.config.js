// 去除打包后的console.log
const plugins = [];
// 生产环境下
if (process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: plugins
}
