import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'count'
})
export class CountPipe implements PipeTransform{

  transform(value:string|any[], args:string[]):number {
    return value
      ? value.length
      : 0;
  }

}
