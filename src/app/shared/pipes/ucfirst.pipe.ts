import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucfirst'
})
export class UCFirstPipe implements PipeTransform{

  transform(value: string, args?: any): string{
    if(typeof value == 'string'){
      return `${value.charAt(0).toUpperCase()}${value.substr(1)}`;
    }
    return value;
  }
}
