import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  standalone: true,
  name: 'position',
})
export class PositionPipe implements PipeTransform {
  transform(value: string | number): string {
    const d = typeof value === 'string' ? parseInt(value) : value
    if (d > 3 && d < 21) return `${d}th`
    switch (d % 10) {
      case 1:
        return `${d}st`
      case 2:
        return `${d}nd`
      case 3:
        return `${d}rd`
      default:
        return `${d}th`
    }
  }
}
