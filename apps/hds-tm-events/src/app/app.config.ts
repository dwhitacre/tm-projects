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
    LeaderboardService,
    LogService,
    MessageService,
    AdminService,
    StoreService,
    PositionPipe,
    WeeklyService,
    MatchService,
    PlayerService,
    MapService,
    TmPipe,
    SafeHtmlPipe,
  ],
}
