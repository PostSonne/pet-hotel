import webpack from "webpack";
import path from "path";
import { getWebpackPlugins } from "./webpack.plugins";
import { getWebpackRules } from "./webpack.rules";
import { getWebpackResolve } from "./webpack.resolve";

export const getWebpackBaseConfig = (): webpack.Configuration => {
  return {
    entry: [path.join(process.cwd(), "src", "index")],
    mode: "development",
    devtool: "cheap-module-source-map",
    output: {
      publicPath: "/",
      path: path.join(process.cwd(), "dist"),
      filename: "app.js",
    },
    resolve: getWebpackResolve(),
    module: {
      rules: getWebpackRules(),
    },
    plugins: getWebpackPlugins(),
  };
};
