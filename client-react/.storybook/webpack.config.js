const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (_config, env) => {
  const config = genDefaultConfig(_config, env);

  // Extend it as you need.
  config.resolve.extensions.push(".ts", ".tsx");

  config.module.rules.unshift(
    {
      test: /\.tsx?$/,
      use: ['babel-loader', 'ts-loader'],
    }
  );

  return config;
};
