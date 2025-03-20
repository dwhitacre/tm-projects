import { Pipe, PipeTransform } from '@angular/core'
import { htmlify, humanize } from 'tm-text'

export type TmTransformTypes = 'humanize' | 'htmlify' | 'tokenize' | 'blockify'

@Pipe({
  standalone: true,
  name: 'tm',
})
export class TmPipe implements PipeTransform {
  transform(value: string, type?: TmTransformTypes): string {
    switch (type) {
      case 'humanize':
        return humanize(value)
      default:
        return htmlify(value)
    }
  }
}
