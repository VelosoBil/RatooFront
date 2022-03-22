import path from 'path';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import {} from './env';
import rawdocs from './rawdocs';
import rawicons from './rawicons';
import createSSR from './SSR/createSSR';
import config from './../app/config';

const { host, port } = config.server;
const app = express();

export default function (parameters) {
  if (config.isProd) {
    app.use(compression());
  }
  app.disable('etag');
  app.disable('x-powered-by');
  app.use('/', express.static('static', { etag: false }));
  app.use(favicon(path.join('static', 'favicons', 'favicon.ico')));

  app.use((req, res, next) => {
    if (config.ssl) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(302, 'https://' + req.hostname + req.originalUrl);
      } else {
        next();
      }
    } else {
      next();
    }
  });

  [{
    "resource": "/c:/boss-lite-master/src/server/server.js",
    "owner": "typescript",
    "code": "1005",
    "severity": 8,
    "message": "'{' esperado.",
    "source": "ts",
    "startLineNumber": 37,
    "startColumn": 21,
    "endLineNumber": 37,
    "endColumn": 22
  }]

  app.get('/api/icons', (req, res) => {
    res.json({
      records: [
        { source: rawicons(req.query) }
      ]
    });
  });

  app.get('/api/users', (req, res) => {
    res.json({
      records: [
        { id: 1, name: 'Compadre washington' },
        { id: 2, name: 'Latrell spencer' },
      ]
    });
  });

  app.get('*', createSSR(parameters && parameters.chunks()));

  const server = app.listen(port, (err) => { // eslint-disable-line
    if (err) {
      return console.error(err);
    }
    console.info(`Listening at ${host}:${port}`);
  });

  return {
    server,
    app
  };
}
