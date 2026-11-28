const path = require("path");
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  // GitHub Pages serves the app from /calculacarrinho/
  publicPath:
    process.env.VUE_APP_PUBLIC_PATH ||
    (process.env.NODE_ENV === "production" ? "/calculacarrinho/" : "/"),
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

    // Each brand ships only its own icons, splash screens and manifest
    const isTaQuanto = process.env.VUE_APP_MANIFEST === "manifest-ta-quanto.json";
    config.plugin("copy").tap(args => {
      args[0][0].ignore.push(
        ...(isTaQuanto
          ? ["img/icons/**", "img/splash/**", "manifest.json"]
          : ["img/ta-quanto/**", "manifest-ta-quanto.json"])
      );
      return args;
    });

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
  lintOnSave: true
};
