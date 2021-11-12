import autoprefix from "autoprefixer";
import webpack from "webpack";
import path from "path";

export const getWebpackRules = (): webpack.Configuration["module"]["rules"] => {
  return [
    {
      test: /\.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      exclude: /node_modules/,
    },
    {
      test: /\.scss|\.css$/,
      use: [
        "style-loader",
        {
          loader: 'css-loader',
          options: {
            localsConvention: 'camelCase',
            modules: {
              localIdentName: '[name]__[local]__[hash:base64:5]',
              auto: (resourcePath) => {
                return !resourcePath.endsWith(path.join('ui-kit', 'lib', 'main.css'))
                    && !resourcePath.endsWith(path.join('styles', 'main.css'));
              },
            },
          },
        },
        {
          loader: "postcss-loader",
          options: {
            ident: "postcss",
            plugins: () => [autoprefix()],
          },
        },
        { loader: "sass-loader" },
      ],
    },
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    },
    {
      test: /\.(jpeg|jpg|png|docx)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            esModule: false,
          },
        },
      ],
    },
    { test: /\.(woff|woff2|eot|ttf)$/, use: ["url-loader?limit=100000"] },
  ];
};
