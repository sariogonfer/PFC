import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time_format'})
export class MyTimePipe implements PipeTransform {
  transform(seconds: number): string {
    var s_num = seconds % 60;
    var m_num = Math.floor((seconds % 3600) / 60);

    var s = ('0' + s_num).slice(-2);
    var m = ('0' + m_num).slice(-2);

    return `${m}m ${s}s`;
  }
}
