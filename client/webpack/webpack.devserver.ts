import path from "path";
import WebpackDevServer from "webpack-dev-server";


export const getWebpackDevServerConfig = (
): WebpackDevServer.Configuration => ({
  contentBase: path.join(process.cwd(), "public"),
  port: 3000,
  liveReload: true,
  historyApiFallback: true,
  proxy: {
    "/v1": {
      target: 'http://msonb-related-person-service-ds1-genr01-onbc-onb-development.apps.ds1-genr01.corp.dev.vtb',
    },
  },
});
