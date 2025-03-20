import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private messageService: MessageService) {}

  success(summary: string, detail: string, notify = true) {
    console.log(summary, detail)
    if (notify) {
      this.messageService.add({
        severity: 'success',
        summary,
        detail,
        key: 'log',
      })
    }
  }

  error(error: HttpErrorResponse | Error) {
    console.error(error)
    this.messageService.add({
      severity: 'error',
      summary: error.name,
      detail: error.message,
      sticky: true,
      key: 'log',
    })
  }
}
