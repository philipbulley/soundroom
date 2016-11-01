import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'srCount',
})
export class CountPipe implements PipeTransform {

  transform( value:string|any[], args:string[] ):number {
    return value
      ? value.length
      : 0;
  }

}
