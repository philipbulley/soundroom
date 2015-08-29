var _ = require('lodash'),
  ObjectUtil = require('./ObjectUtil');

function FunctionUtil() {

}

_.extend(FunctionUtil, {

  /**
   * Bind all methods on `scope` to that `scope`.
   *
   * Normal fat arrow/lambda functions in TypeScript are simply member functions
   * that replace the value of `this`, with `_this` (a reference to `this` from
   * within the constructor's scope). They're not on the prototype and as such do not
   * support inheritance. So no calling `super.myMethod()` if it's been
   * declared with a `=>`.
   *
   * `FunctionUtil.bindAllMethods( this )` should be called from the base class' constructor.
   * It will bind each method as such that it will always execute using the class scope.
   *
   * Essentially, we should now write class methods without `=>`. When executed,
   * the scope will be preserved and they will importantly continue to support
   * inheritance. Fat arrow/lambda functions (`=>`) are still great when you
   * don't require inheritance, for example, when using anonymous function callbacks.
   *
   * @param scope     Usually, pass the value of `this` from your base class.
   */
  bindAllMethods: function (scope) {
    for (var p in scope) {
      // Find the object in which prop was originally defined on
      var ownObject = ObjectUtil.getPropertyDefinitionObject(scope, p);

      // Now we can check if it is a getter/setter
      var descriptor = Object.getOwnPropertyDescriptor(ownObject, p);
      if (descriptor && (descriptor.get || descriptor.set))
        continue;   // Don't bind if `scope[p]` is a getter/setter, we'd be attemping to bind the value returned by the getter

      // Only bind if scope[p] is a function that's not already a class member
      // the bound function will be added as a class member, referencing the function on the prototype
      if (!Object.prototype.hasOwnProperty.call(scope, p) && typeof scope[p] == 'function')
        scope[p] = scope[p].bind(scope);
    }
  }
});

module.exports = FunctionUtil;
