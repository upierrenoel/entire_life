import superagent from 'superagent';
import config from '../config';
import cookie from 'cookie';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return config.apiHost + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

function getRawCookies(req) {
  if (req) return req.get('cookie');
  return document.cookie;
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, onlyIf } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        const cookies = cookie.parse(getRawCookies(req));
        request.set('Authorization', `Bearer ${cookies.idToken}`);

        if (onlyIf && !onlyIf(cookies)) reject('request aborted; onlyIf condition failed');

        if (params) {
          request.query(params);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err
          ? reject(body || err)
          : resolve({result: body, cookies})
        );
      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
