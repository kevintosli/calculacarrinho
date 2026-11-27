const path = require("path");
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  // GitHub Pages serves the app from /calculacarrinho/
  publicPath: process.env.NODE_ENV === "production" ? "/calculacarrinho/" : "/",
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
        "@js": path.resolve(__dirname, "src/js"),
        "@components": path.resolve(__dirname, "src/components"),
        "@views": path.resolve(__dirname, "src/views")
      }
    }
  },
  chainWebpack: config => {
    // Don't prefetch lazy chunks: the only one is the desktop QR code,
    // which phones never need
    config.plugins.delete("prefetch");

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
  lintOnSave: true
};
