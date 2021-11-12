import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";


export const getWebpackPlugins = (
): webpack.WebpackPluginInstance[] => {
  return [
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), "public", "index.html"),
      hash: true,
    }),
    new CopyWebpackPlugin({
        patterns: [{
          from: "public",
          to: "",
          globOptions: {
            ignore: ['**.html']
          }
          },
        ],
    }),
  ];
};
