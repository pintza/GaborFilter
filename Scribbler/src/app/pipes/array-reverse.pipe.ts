import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayReverse',
  pure: false
})
export class ArrayReversePipe implements PipeTransform {

    constructor() {
      
    }

    transform(value) {
      if (!value) return;

      return value.reverse();
    }

}
