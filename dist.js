'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Axios = require('axios');

module.exports = function (app) {
  var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var dfConf = {
    timeout: 30000,
    responseType: 'json',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  };

  var dataDf = {
    errno: 1,
    errmsg: '',
    data: {}
  };

  var axios = Axios.create((0, _assign2.default)(dfConf, conf));

  function serialize(query) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '?';

    var urlText = '';
    if ((typeof query === 'undefined' ? 'undefined' : (0, _typeof3.default)(query)) === 'object') {
      (0, _keys2.default)(query).forEach(function (key) {
        if (typeof query[key] !== 'undefined' && query[key] !== 'undefined' && query[key] !== '') {
          if (type === '?') {
            urlText += '&' + key + '=' + query[key];
          } else {
            urlText += '/' + key + '/' + query[key];
          }
        }
      });
    }
    return urlText.replace(/^&/, '?');
  }

  function httpError(res) {
    var url = '';
    var errmsg = '';
    if (res.response) {
      url = res.response.config.url;
      errmsg = '\u51FA\u9519\u4E86 \u9519\u8BEF\u4EE3\u7801: ' + res.response.status + '  \u9519\u8BEF\u4FE1\u606F: ' + res.response.statusText;
    } else {
      url = res.config.url;
      errmsg = '\u8BF7\u6C42\u51FA\u9519\uFF0C\u8BF7\u68C0\u67E5\u60A8\u7684\u7F51\u7EDC\u914D\u7F6E ' + res;
    }
    app.think.logger.error('\u8BF7\u6C42\uFF1A' + url + ' \u51FA\u9519');
    app.think.logger.error(new Error(errmsg));
    var data = {};
    if (res.response && res.response.data) {
      data = res.response.data;
    }
    return (0, _assign2.default)(dataDf, { errmsg: errmsg, data: data });
  }

  function httpGet(url) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var req = { url: url + serialize(opt), conf: conf };
    return axios(req).then(function (res) {
      return (0, _assign2.default)(dataDf, { errno: 0, data: res.data });
    }, function (res) {
      return httpError(res);
    });
  }

  function httpPost(url) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return axios.post(url, opt, conf).then(function (res) {
      return (0, _assign2.default)(dataDf, {
        errno: 0,
        data: res.data
      });
    }, function (res) {
      return httpError(res);
    });
  }

  return {
    think: {
      axios: axios,
      httpGet: httpGet,
      httpPost: httpPost
    },
    context: {
      axios: axios,
      httpGet: httpGet,
      httpPost: httpPost
    },
    controller: {
      axios: axios,
      httpGet: httpGet,
      httpPost: httpPost
    },
    service: {
      axios: axios,
      httpGet: httpGet,
      httpPost: httpPost
    }
  };
};
