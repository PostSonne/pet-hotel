import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import { getWebpackBaseConfig } from "./webpack.base";
import { getWebpackDevServerConfig } from "./webpack.devserver";
import { getWebpackPlugins } from "./webpack.plugins";


interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

module.exports = function () {
  const config: Configuration = {
    ...getWebpackBaseConfig(),
    mode: "development",
    target: "web",
    devServer: getWebpackDevServerConfig(),
    plugins: getWebpackPlugins(),
  };

  return config;
};
