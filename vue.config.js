const path = require("path");
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  publicPath: "/calculacarrinho/",
  // pluginOptions: {
  //   "style-resources-loader": {
  //     preProcessor: "scss",
  //     patterns: [path.resolve(__dirname, "src/scss/base.scss")]
  //   }
  // },
  configureWebpack: {
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@scss": path.resolve(__dirname, "src/scss"),
        "@components": path.resolve(__dirname, "src/components"),
        "@views": path.resolve(__dirname, "src/views")
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
  lintOnSave: true
};
