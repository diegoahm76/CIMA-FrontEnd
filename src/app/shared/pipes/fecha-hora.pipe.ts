import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fechaHora'
})
export class FechaHoraPipe implements PipeTransform{

  transform(value: string): string{
    let pos: number = value.lastIndexOf(':');
    if(pos != -1){
      value = value.substring(0, pos);
    }
    return value;
  }
}
