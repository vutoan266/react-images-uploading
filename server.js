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

app.use(express.static('dist'));
app.use('/', router);

if (process.env.NODE_ENV === 'development') {
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
} else {
  router.get('/', function(req, res) {
    res.sendFile('index.html', { root: path.resolve(__dirname, 'dist') });
  });
}

const port = 8080;
app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`> ${process.env.NODE_ENV}`);
  console.log(`> Ready on http://localhost:${port}`);
});
