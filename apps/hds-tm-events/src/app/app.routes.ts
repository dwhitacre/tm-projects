import { Route } from '@angular/router'
import { StandingsComponent } from './standings.component'
import { WeeklyComponent } from './weekly.component'
import { StatsComponent } from './stats.component'
import { RulesComponent } from './rules.component'
import { FeatureToggle, isEnabled } from 'src/domain/feature'
import { HomeComponent } from './home.component'

const routes: Route[] = [
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
    path: 'weeklyleague',
    redirectTo: 'weeklyleague/standings',
  },
  {
    path: '**',
    redirectTo: isEnabled(FeatureToggle.homepage) ? '' : 'weeklyleague/standings',
  },
]

if (isEnabled(FeatureToggle.homepage))
  routes.push({
    path: '',
    component: HomeComponent,
  })

export const appRoutes = routes
