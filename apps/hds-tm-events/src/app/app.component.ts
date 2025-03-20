import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
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
}
