var _ = require('lodash');

function ObjectUtil() {

}

_.extend(ObjectUtil, {

  /**
   * Searches the supplied object, and then down it's prototype chain until it
   * finds the object where `prop` is its own property. In other words, finds
   * the object in which `prop` was actually defined on, skipping objects that
   * merely inherit `prop`. This is useful when using methods like
   * `Object.getOwnPropertyDescriptor()` which only work on "own" properties.
   *
   * @param scope   The scope on which to start checking for
   * @param prop    The name of the property we're searching for
   * @returns {*}
   */
  getPropertyDefinitionObject: function (scope, prop) {
    if (!scope)
      return null;

    return scope.hasOwnProperty(prop)
      ? scope
      : this.getPropertyDefinitionObject(Object.getPrototypeOf(scope), prop);
  }
});

module.exports = ObjectUtil;
