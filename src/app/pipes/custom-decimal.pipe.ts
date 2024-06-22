import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDecimal',
  standalone: true,
})
export class CustomDecimalPipe implements PipeTransform {

  transform(value: number, digits: string = '1.2-2'): string {
    if (value == null) return '';
    const formattedValue = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return formattedValue.replace(/,/g, '');
  }

}
