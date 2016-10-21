/*
 * There are so many reasons I want to puke all over this technique of extending
 * native JS Error(), but it seems to be the most workable solution via Typescript.
 *
 *      .-'"'-.
 *     / `. ,' \
 *    |  ,' `.  |
 *    |   ___   |
 *     \ ( . ) /
 *      '-.:.-'
 *        .:.
 *        :::          lf
 *        :::
 *        ::.
 *        '::
 *         '
 *
 * RIGHT. Now that's out of the way...
 *
 * The important thing is that errors look good in the console (ie. they're as descriptive as possible
 * via name, stack and optional message), and they are type checkable at runtime using `instanceof`.
 *
 * Consider the dirt to be hidden away in this file only, app errors which extend `AbstractError` can exist
 * in their own files and appear as concise as possible.
 */

module soundroomError {
  /**
   * Strategy here is to only ever subclass Error with AbstractError, then all custom errors in the app can
   * extend AbstractError.
   */
  export declare class CustomError {
    public name:string;
    public message:string;
    public stack:string;

    constructor( message?:string );
  }
  /* tslint:disable-next-line:no-eval */
  eval('soundroomError.CustomError = Error');
}


/**
 * AbstractError extends Error for the purpose of type checking at runtime.
 *
 *    `myError instanceof Error;   // true`
 *
 * But the stack (where available) isn't captured when simply subclassing Error.
 * So the most bullet proof way currently appears to be creating another `new Error()`
 * (composition) and copying it's `stack` across. PUKE.
 *
 * `Error.captureStackTrace()` may be another way but seems too platform specific (V8),
 * so I think it's safer to create a `new Error()` and simply grab it's stack if its
 * available.
 */
export abstract class AbstractError extends soundroomError.CustomError {
  constructor( public name:string, public message?:string, public model?:any ) {
    super(message);

    var e = new soundroomError.CustomError(message);
    e.name = this.name;
    if (e.stack) {
      this.stack = e.stack;
    }
  }

  /**
   * Please override this, switching on the `this.type` and returning an error message. Please default to
   * calling `return super.getFriendlyMessage()`.
   *
   * @param type
   * @returns {string}
   */
  getFriendlyMessage():string {
    return 'Aww... we have a little problem!';
  }
}
