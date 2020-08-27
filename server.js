const webpack = require('webpack');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackDevConfig = require('./webpack/webpack.dev');
const router = express.Router();

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('build'));
app.use('/', router);

const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  router.get('/', function(req, res) {
    res.sendFile('index.html', { root: path.resolve(__dirname, 'build') });
  });
} else {
  /**
   * Hot reload
   * https://github.com/webpack/webpack-dev-middleware
   */
  const compiler = webpack(webpackDevConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      // webpack-dev-middleware options
      publicPath: webpackDevConfig.output.publicPath
    })
  );
}

const port = 8080;
app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`> ${env}`);
  console.log(`> Ready on http://localhost:${port}`);
});
