import { ApplicationConfig, inject } from '@angular/core'
import { provideRouter } from '@angular/router'
import { appRoutes } from './app.routes'
import { provideAnimations } from '@angular/platform-browser/animations'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'
import { MessageService } from 'primeng/api'
import { PositionPipe } from 'src/pipes/position.pipe'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { HttpInterceptorFn } from '@angular/common/http'
import { AdminService } from 'src/services/admin.service'
import { StoreService } from 'src/services/store.service'
import { WeeklyService } from 'src/services/weekly.service'
import { MatchService } from 'src/services/match.service'
import { PlayerService } from 'src/services/player.service'
import { MapService } from 'src/services/map.service'
import { TmPipe } from 'src/pipes/tm.pipe'
import { SafeHtmlPipe } from 'src/pipes/safe-html.pipe'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura'
import { EventService } from 'src/services/event.service'
import { FeatureService } from 'src/services/feature.service'
import { PostService } from 'src/services/post.service'
import { RuleService } from 'src/services/rule.service'
import { TeamService } from 'src/services/team.service'
import { TagService } from 'src/services/tag.service'
import { TeamRoleService } from 'src/services/teamrole.service'
import { OrganizationService } from 'src/services/organization.service'

export const adminkeyInterceptor: HttpInterceptorFn = (req, next) => {
  const adminService = inject(AdminService)
  if (adminService && adminService.has()) {
    req = req.clone({
      setHeaders: {
        'x-hdstmevents-adminkey': adminService.get() ?? '',
      },
    })
  }
  return next(req)
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([adminkeyInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    AdminService,
    EventService,
    FeatureService,
    LeaderboardService,
    LogService,
    MapService,
    MatchService,
    MessageService,
    OrganizationService,
    PlayerService,
    PostService,
    RuleService,
    StoreService,
    TagService,
    TeamService,
    TeamRoleService,
    WeeklyService,
    PositionPipe,
    SafeHtmlPipe,
    TmPipe,
  ],
}
