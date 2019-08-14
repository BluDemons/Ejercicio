import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtros'
})
export class FiltrosPipe implements PipeTransform {

  transform(value: any, ...arg: any[]): any {
    const resultadoMateriales = [];
    for (const item of value) {
      if (item.nombre.indexOf(arg) > -1) {
        resultadoMateriales.push(item);
      }
    }
    return resultadoMateriales;
  }

}
