import { Component } from '@angular/core'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { ToastModule } from 'primeng/toast'

@Component({
  standalone: true,
  imports: [RouterModule, ToastModule],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast key="log"></p-toast>
  `,
  styles: [],
})
export class AppComponent {
  title = 'app'

  constructor(router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0)
      }
    })
  }
}
