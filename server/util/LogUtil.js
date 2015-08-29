var _ = require('lodash');

function LogUtil() {

}

_.extend(LogUtil, {

  /** Level of logging. Default is set just above export */
  level: NaN,

  /** Errors only */
  LEVEL_ERROR: 0,

  /** Errors and info only */
  LEVEL_INFO: 1,

  /** Errors, info and debug */
  LEVEL_DEBUG: 2,

  /**
   * Verbose debug logging
   */
  debug: function () {
    if (this.level >= this.LEVEL_DEBUG && typeof(console) !== 'undefined') {
      var a = Array.prototype.slice.call(arguments);
      a.unshift('[' + new Date().toUTCString() + '] (DEBUG)');
      console.log.apply(console, a);
    }
  },

  /**
   * Useful info logging
   */
  info: function () {
    if (this.level >= this.LEVEL_INFO && typeof(console) !== 'undefined') {
      var a = Array.prototype.slice.call(arguments);
      a.unshift('[' + new Date().toUTCString() + ']');
      console.log.apply(console, a);
    }
  },

  /**
   * Error logging
   */
  error: function () {
    if (this.level >= this.LEVEL_ERROR && typeof(console) !== 'undefined') {
      var a = Array.prototype.slice.call(arguments);
      a.unshift('*************** ERROR ******************\n[' + new Date().toUTCString() + ']');
      a.push('\n****************************************');
      console.error.apply(console, a);
    }
  },

  formatError: function (err, title) {
    this.error((title ? title + ':' : '')
      + '\n', err, '\n', err.stack);
  }

});


// Set default level
LogUtil.level = LogUtil.LEVEL_INFO;

module.exports = LogUtil;
