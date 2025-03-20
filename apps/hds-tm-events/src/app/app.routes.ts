import { Route } from '@angular/router'
import { StandingsComponent } from './standings.component'
import { WeeklyComponent } from './weekly.component'
import { StatsComponent } from './stats.component'
import { RulesComponent } from './rules.component'

export const appRoutes: Route[] = [
  {
    path: 'standings',
    component: StandingsComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'weekly',
    component: WeeklyComponent,
  },
  {
    path: 'rules',
    component: RulesComponent,
  },
  {
    path: '**',
    redirectTo: 'standings',
  },
]
