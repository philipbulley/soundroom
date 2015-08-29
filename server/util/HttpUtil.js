var _ = require('lodash'),
  HttpStatus = require('http-status');

function HttpUtil() {

}

_.extend(HttpUtil, {

  status: HttpStatus,

  sendJsonError: function (res, statusCode, obj) {
    obj = _.extend({
      status: statusCode,
      error: HttpStatus[statusCode],
    }, obj || {});

    res.status(statusCode)
      .json(obj);
  }
});

module.exports = HttpUtil;
