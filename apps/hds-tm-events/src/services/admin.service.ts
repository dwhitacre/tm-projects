import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AdminService {
  #baseUrl = 'api/admin'
  #storageKey = 'hds-tm-events.admin-key'

  constructor(private httpClient: HttpClient) {}

  validate() {
    return this.httpClient.get(this.#baseUrl)
  }

  save(key: string) {
    localStorage.setItem(this.#storageKey, key)
  }

  get() {
    return localStorage.getItem(this.#storageKey)
  }

  has() {
    return !!this.get()
  }
}
