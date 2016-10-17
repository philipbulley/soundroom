import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

/**
 * @ngdoc filter
 * @name moment
 * @example
 *
 *     {{'2016-04-11T14:42:01.228Z' | moment:'fromNow'}}                              // 2 days ago
 *     {{'2016-04-11T14:42:01.228Z' | moment:['fromNow']}}                            // 2 days ago
 *     {{'2016-04-11T14:42:01.228Z' | moment:['format', 'MMMM Do YYYY, h:mm:ss a]}}    // April 11th 2016, 3:42:01 pm
 *     // TODO: Implement chained calls using something like `moment|[startOf:['day'], 'fromNow']` any string values in array will always be a method if the array contains an object at any index
 */
@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {

  transform( input:Date|string, args:any[] ):string {
    return input
      ? this.applyArgs(this.momentify(input), args)
      : '';
  }

  momentify( input ) {

    if (typeof input === 'string') {
      return moment(new Date(input));
    } else {
      return moment(input);
    }

  }

  applyArgs( momentified, args ) {
    if (typeof args === 'undefined') {
      return momentified;
    }

    if (typeof args === 'string') {
      return momentified[args]();
    }

    if (args.length > 0) {
      console.log('MomentPipe.applyArgs: args:', args);
      const fnName = args.shift();

      return momentified[fnName].apply(momentified, args);
    }
  }

}

