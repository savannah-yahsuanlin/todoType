const { resolve } = require("path");

module.exports = () => {
  return {
    entry: [
      "./src/App.tsx",
		],
    mode: "development",
    devtool: "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      modules: ["src", "node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: [resolve(__dirname, "src")],
          use: ["babel-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    output: {
      path: resolve(__dirname, "/dist"),
      filename: "bundle.js",
    },
    externals: {
      React: 'React',
      ReactDOM: "ReactDOM",
    },
    devServer: {
			static: {
      	directory: resolve(__dirname, "./"),
				watch: true
    	},
      compress: true,
      historyApiFallback: true,
      port: 9000,
			devMiddleware: {
      	publicPath: "/dist",
    	}
    }
  };
};