import { Route } from '@angular/router'
import { StandingsComponent } from './standings.component'
import { WeeklyComponent } from './weekly.component'
import { StatsComponent } from './stats.component'
import { RulesComponent } from './rules.component'

export const appRoutes: Route[] = [
  {
    path: 'weeklyleague/standings',
    component: StandingsComponent,
  },
  {
    path: 'weeklyleague/stats',
    component: StatsComponent,
  },
  {
    path: 'weeklyleague/weekly',
    component: WeeklyComponent,
  },
  {
    path: 'weeklyleague/rules',
    component: RulesComponent,
  },
  {
    path: 'standings',
    redirectTo: 'weeklyleague/standings',
  },
  {
    path: 'stats',
    redirectTo: 'weeklyleague/stats',
  },
  {
    path: 'weekly',
    redirectTo: 'weeklyleague/weekly',
  },
  {
    path: 'rules',
    redirectTo: 'weeklyleague/rules',
  },
  {
    path: '**',
    redirectTo: 'weeklyleague/standings',
  },
]
