import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { concatLatestFrom, tapResponse } from '@ngrx/operators'
import { defaultIfEmpty, from, last, map, mergeMap, noop, Observable, of, switchMap, take, tap } from 'rxjs'
import { Leaderboard, Stat } from 'src/domain/leaderboard'
import { Weekly, WeeklyResult } from 'src/domain/weekly'
import { Map } from 'src/domain/map'
import { MatchType, MatchDecorated, matchTypeOrder } from 'src/domain/match'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'
import { WeeklyService } from './weekly.service'
import { MatchService } from './match.service'
import { PlayerService } from './player.service'
import { MapService } from './map.service'
import { Player } from 'src/domain/player'
import { RuleCategory } from 'src/domain/rule'
import { RuleService } from './rule.service'
import { FeatureService, FeatureToggleState } from './feature.service'
import { FeatureToggle } from 'src/domain/feature'
import { TeamService } from './team.service'
import { PostService } from './post.service'
import { EventService } from './event.service'
import { Team, TeamPlayer } from 'src/domain/team'
import { Post } from 'src/domain/post'
import { Event, EventPlayer } from 'src/domain/event'
import { Tag } from 'src/domain/tag'
import { TeamRole } from 'src/domain/teamrole'
import { Organization } from 'src/domain/organization'
import { TeamRoleService } from './teamrole.service'
import { TagService } from './tag.service'
import { OrganizationService } from './organization.service'
import { Embed } from 'src/domain/embed'

export interface StoreState {
  leaderboard: Leaderboard
  leaderboardUid: Leaderboard['leaderboardId']
  leaderboardPublished: boolean
  loading: boolean
  toplimit: number
  bottomlimit: number
  isAdmin: boolean
  selectedWeekly: Weekly['weeklyId']
  nemesisWeights: {
    win: number
    loss: number
    match: number
  }
  maps: Array<Map>
  weeklies: { [weeklyId: Weekly['weeklyId']]: Partial<Weekly> }
  rules: Array<RuleCategory>
  featureToggles: FeatureToggleState[]
  // organizations: Array<Organization>
  selectedOrganization: Organization['organizationId']
  teams: Array<Team>
  posts: Array<Post>
  events: Array<Event>
  tags: Array<Tag>
  teamRoles: Array<TeamRole>
  players: Array<Player>
  eventEmbeds: { [eventId: Event['eventId']]: Blob | undefined }
}

@Injectable({ providedIn: 'root' })
export class StoreService extends ComponentStore<StoreState> {
  readonly leaderboard$ = this.select((state) => state.leaderboard)
  readonly leaderboardUid$ = this.select((state) => state.leaderboardUid)
  readonly leaderboardPublished$ = this.select((state) => state.leaderboardPublished)
  readonly loading$ = this.select((state) => state.loading)
  readonly toplimit$ = this.select((state) => state.toplimit)
  readonly bottomlimit$ = this.select((state) => state.bottomlimit)
  readonly isAdmin$ = this.select((state) => state.isAdmin)
  readonly selectedWeekly$ = this.select((state) => state.selectedWeekly)
  readonly nemesisWeights$ = this.select((state) => state.nemesisWeights)
  readonly maps$ = this.select((state) => state.maps)
  readonly weeklies$ = this.select((state) => state.weeklies)
  readonly rules$ = this.select((state) => state.rules)
  readonly featureToggles$ = this.select((state) => state.featureToggles)
  // readonly organizations$ = this.select((state) => state.organizations)
  readonly selectedOrganization$ = this.select((state) => state.selectedOrganization)
  readonly tags$ = this.select((state) => state.tags)
  readonly teamRoles$ = this.select((state) => state.teamRoles)
  readonly teams$ = this.select((state) => state.teams)
  readonly posts$ = this.select((state) => state.posts)
  readonly events$ = this.select((state) => state.events)
  readonly players$ = this.select((state) => state.players)
  readonly eventEmbeds$ = this.select((state) => state.eventEmbeds)

  readonly leaderboardPlayers$ = this.select((state) =>
    state.leaderboard.players.sort((playerA, playerB) => {
      if (playerA.name == playerB.name) return playerA.accountId.localeCompare(playerB.accountId)
      return playerA.name.localeCompare(playerB.name)
    }),
  )
  readonly weeklyIds$: Observable<Array<string>> = this.select((state) =>
    state.leaderboard.weeklies.map((leaderboardWeekly) => leaderboardWeekly.weekly.weeklyId).reverse(),
  )
  readonly teamPlayers$ = this.select(this.teams$, (teams) => {
    const teamPlayerDict = new Map<TeamPlayer['accountId'], TeamPlayer>()
    const teamPlayers = teams.reduce((acc, team) => {
      if (!team.players) return acc

      for (const player of team.players) {
        if (teamPlayerDict.has(player.accountId)) continue

        teamPlayerDict.set(player.accountId, player)
        acc.push(player)
      }

      return acc
    }, [] as Array<TeamPlayer>)

    teamPlayers.sort((playerA, playerB) => {
      if (playerA.name == playerB.name) return playerA.accountId.localeCompare(playerB.accountId)
      return playerA.name.localeCompare(playerB.name)
    })
    return teamPlayers
  })

  readonly stats$: Observable<Array<Stat>> = this.select(
    this.leaderboard$,
    this.toplimit$,
    this.nemesisWeights$,
    (leaderboard, toplimit, nemesisWeights) => {
      const stats = leaderboard.tops.reduce<{ [_: string]: Stat }>((pv, cv) => {
        pv[cv.player.accountId] = Object.assign({}, cv, {
          weekliesPlayed: 0,
          averageWeeklyPosition: 0,
          weeklyWins: 0,
          weeklyLosses: 0,
          weeklyRunnerups: 0,
          averageWeeklyScore: 0,
          earningsAmount: 0,
          averageQualifierPosition: 0,
          qualifiedAmount: 0,
          matchWins: 0,
          matchLosses: 0,
          mapWins: 0,
          mapLosses: 0,
          opponents: {},
          opponentsSorted: [],
        })
        return pv
      }, {})

      leaderboard.weeklies.forEach((leadboardWeekly) => {
        leadboardWeekly.weekly.results.forEach((weeklyResult) => {
          const stat = stats[weeklyResult.player.accountId]
          if (weeklyResult.position <= toplimit) {
            stat.averageWeeklyPosition =
              (weeklyResult.position + stat.qualifiedAmount * stat.averageWeeklyPosition) / (stat.qualifiedAmount + 1)
            stat.qualifiedAmount++
          }
          stat.averageWeeklyScore =
            (weeklyResult.score + stat.weekliesPlayed * stat.averageWeeklyScore) / (stat.weekliesPlayed + 1)
          stat.weekliesPlayed++
          if (weeklyResult.position > 2) stat.weeklyLosses++
        })

        leadboardWeekly.weekly.matches.forEach((weeklyMatch) => {
          if (weeklyMatch.match.matchId.endsWith('qualifying')) {
            weeklyMatch.match.results.forEach((matchResult, idx) => {
              const stat = stats[matchResult.player.accountId]
              stat.averageQualifierPosition =
                (idx + 1 + (stat.weekliesPlayed - 1) * stat.averageQualifierPosition) / stat.weekliesPlayed
            })
          } else if (weeklyMatch.match.matchId.toLowerCase().indexOf('tiebreak') < 0) {
            if (weeklyMatch.match.results.length < 2) return
            if (weeklyMatch.match.results[0].score === 0 && weeklyMatch.match.results[1].score === 0) return

            if (weeklyMatch.match.matchId.endsWith('-finals')) {
              stats[weeklyMatch.match.results[0].player.accountId].weeklyWins++
              stats[weeklyMatch.match.results[0].player.accountId].earningsAmount += 70
              stats[weeklyMatch.match.results[1].player.accountId].weeklyRunnerups++
              stats[weeklyMatch.match.results[1].player.accountId].earningsAmount += 30
            }

            weeklyMatch.match.results.forEach((matchResultA, idxA) => {
              const statA = stats[matchResultA.player.accountId]
              if (idxA == 0) statA.matchWins++
              else statA.matchLosses++

              weeklyMatch.match.results.forEach((matchResultB, idxB) => {
                const statB = stats[matchResultB.player.accountId]
                if (idxA != idxB) {
                  statB.opponents[matchResultA.player.accountId] ??= {
                    player: matchResultA.player,
                    matchWins: 0,
                    matchLosses: 0,
                    mapWins: 0,
                    mapLosses: 0,
                  }
                  if (idxB == 0) statB.opponents[matchResultA.player.accountId].matchWins++
                  else statB.opponents[matchResultA.player.accountId].matchLosses++
                }
              })

              // TODO map data was not captured in this weekly, skip
              if (leadboardWeekly.weekly.weeklyId == '2024-04-27') return

              statA.mapWins += matchResultA.score
              weeklyMatch.match.results.forEach((matchResultB, idxB) => {
                if (idxA != idxB) {
                  statA.mapLosses += matchResultB.score

                  statA.opponents[matchResultB.player.accountId] ??= {
                    player: matchResultB.player,
                    matchWins: 0,
                    matchLosses: 0,
                    mapWins: 0,
                    mapLosses: 0,
                  }
                  statA.opponents[matchResultB.player.accountId].mapWins += matchResultA.score
                  statA.opponents[matchResultB.player.accountId].mapLosses += matchResultB.score
                }
              })
            })
          }
        })
      })

      const calcWeighted = (wins: number, losses: number) => {
        return (
          ((wins + 1) * nemesisWeights.win) / ((losses + 1) * nemesisWeights.loss) +
          nemesisWeights.match / (wins + losses)
        )
      }

      return Object.values(stats).map((stat) => {
        stat.opponentsSorted = Object.values(stat.opponents).sort((opponentA, opponentB) => {
          return (
            calcWeighted(opponentA.matchWins, opponentA.matchLosses) -
            calcWeighted(opponentB.matchWins, opponentB.matchLosses)
          )
        })

        if (stat.opponentsSorted.length > 0) {
          stat.nemesis = stat.opponentsSorted[0].player
          stat.nemesisWins = stat.opponentsSorted[0].matchWins
          stat.nemesisLosses = stat.opponentsSorted[0].matchLosses
        }

        return stat
      })
    },
  )

  readonly standingsVm$ = this.select(this.leaderboard$, this.toplimit$, (leaderboard, toplimit) => ({
    top: leaderboard.tops.filter((_, index) => index < toplimit),
    bottom: leaderboard.tops.filter((_, index) => index >= toplimit),
    playercount: leaderboard.playercount,
    lastModified: leaderboard.lastModified.toLocaleDateString() + ' ' + leaderboard.lastModified.toLocaleTimeString(),
  }))

  readonly statsVm$ = this.select(
    this.stats$,
    this.isAdmin$,
    this.toplimit$,
    this.bottomlimit$,
    (stats, isAdmin, toplimit, bottomlimit) => ({
      stats,
      isAdmin,
      toplimit,
      bottomlimit,
    }),
  )

  readonly weeklyVm$ = this.select(
    this.leaderboard$,
    this.selectedWeekly$,
    this.toplimit$,
    this.weeklyIds$,
    this.players$,
    this.isAdmin$,
    this.weeklies$,
    (leaderboard, selectedWeekly, toplimit, weeklyIds, players, isAdmin, weeklies) => {
      const leaderboardWeekly = leaderboard.weeklies.find(
        (leaderboardWeekly) => leaderboardWeekly.weekly.weeklyId == selectedWeekly,
      )
      const weekly = Object.assign({}, leaderboardWeekly?.weekly, weeklies[selectedWeekly])
      if (!weekly) return { found: false, selectedWeekly, weeklyIds }

      const matches: Array<MatchDecorated> = weekly.matches
        .map((weeklyMatch) => {
          const match = weeklyMatch.match
          const matchParts = match.matchId.replace(weekly.weeklyId + '-', '').split('-')
          const type = matchParts[0] as MatchType
          const displayPositions = [1, 2]

          const decoratedMatch = {
            ...match,
            type,
            order: matchTypeOrder.indexOf(type),
            instance: matchParts.length > 1 ? matchParts.slice(1).join(' ') : '',
            displayPositions,
          }

          if (decoratedMatch.type === 'quarterfinal' && ['a', 'i'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [1, 8]
          else if (decoratedMatch.type === 'quarterfinal' && ['b', 'j'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [4, 5]
          else if (decoratedMatch.type === 'quarterfinal' && ['c', 'k'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [3, 6]
          else if (decoratedMatch.type === 'quarterfinal' && ['d', 'l'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [2, 7]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak a')
            decoratedMatch.displayPositions = [5, -1]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak b')
            decoratedMatch.displayPositions = [6, -1]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak c')
            decoratedMatch.displayPositions = [7, -1]
          else if (decoratedMatch.type === 'semifinal' && decoratedMatch.instance === 'tiebreak')
            decoratedMatch.displayPositions = [3, 4]

          return decoratedMatch
        })
        .sort((matchA, matchB) => {
          if (matchA.order == matchB.order) return matchA.instance.localeCompare(matchB.instance)
          return matchB.order - matchA.order
        })

      // TODO support maps in consuming components
      const maps: Array<WeeklyResult> = (weekly.maps ?? []).map(
        (map) =>
          ({
            player: { name: map.name, image: map.thumbnailUrl } as Player,
          }) as WeeklyResult,
      )

      return {
        found: true,
        published: leaderboardWeekly?.published,
        selectedWeekly,
        weeklyIds,
        top: weekly.results.filter((_, index) => index < toplimit),
        bottom: weekly.results.filter((_, index) => index >= toplimit),
        playercount: weekly.results.length,
        lastModified: undefined,
        matches: matches.slice(0, -1),
        qualifying: matches[matches.length - 1],
        players,
        isAdmin,
        maps,
      }
    },
  )

  constructor(
    private leaderboardService: LeaderboardService,
    private logService: LogService,
    private adminService: AdminService,
    private weeklyService: WeeklyService,
    private matchService: MatchService,
    private playerService: PlayerService,
    private mapService: MapService,
    private ruleService: RuleService,
    private featureService: FeatureService,
    private teamService: TeamService,
    private postService: PostService,
    private eventService: EventService,
    private teamRoleService: TeamRoleService,
    private tagService: TagService,
    private organizationService: OrganizationService,
  ) {
    super({
      leaderboard: {
        leaderboardId: '',
        tops: [],
        playercount: 0,
        weeklies: [],
        lastModified: new Date(0),
        players: [],
      },
      leaderboardUid: 'standings',
      leaderboardPublished: true,
      loading: true,
      toplimit: 8,
      bottomlimit: 16,
      isAdmin: false,
      selectedWeekly: '',
      nemesisWeights: {
        win: 0.5,
        loss: 0.3,
        match: 1.4,
      },
      maps: [],
      weeklies: {},
      rules: [],
      featureToggles: [],
      // organizations: [],
      selectedOrganization: 0,
      teams: [],
      posts: [],
      events: [],
      tags: [],
      teamRoles: [],
      players: [],
      eventEmbeds: {},
    })

    this.fetchFeatureToggles()
    this.fetchOrganizations()
    this.fetchLeaderboard()
    this.fetchPlayers()
    this.fetchRules()
    this.fetchMaps()
    this.fetchAdmin()
  }

  readonly updateSelectedWeeklyState = this.updater((state, selectedWeekly?: string) => ({
    ...state,
    selectedWeekly: selectedWeekly
      ? selectedWeekly
      : state.selectedWeekly || state.leaderboard.weeklies[state.leaderboard.weeklies.length - 1].weekly.weeklyId,
  }))

  readonly updateSelectedWeekly = this.effect<string>((selectedWeekly$) => {
    return selectedWeekly$.pipe(
      tap((selectedWeekly) => this.fetchWeekly(selectedWeekly)),
      tap((selectedWeekly) => this.updateSelectedWeeklyState(selectedWeekly)),
    )
  })

  readonly toggleLeaderboardPublished = this.updater((state) => ({
    ...state,
    leaderboardPublished: !state.leaderboardPublished,
  }))

  readonly fetchLeaderboard = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$, this.leaderboardPublished$]),
      switchMap(([_, leaderboardUid, leaderboardPublished]) =>
        this.leaderboardService.getLeaderboard(leaderboardUid, leaderboardPublished).pipe(
          tapResponse({
            next: (leaderboard) => {
              if (!leaderboard) return this.logService.error(new Error('Leaderboard does not exist.'))
              if (typeof leaderboard.lastModified === 'string')
                leaderboard.lastModified = new Date(leaderboard.lastModified)
              this.patchState({ leaderboard })
              this.updateSelectedWeeklyState(undefined)
              this.updateSelectedWeekly(this.state().selectedWeekly)
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.patchState({ loading: false }),
          }),
        ),
      ),
    )
  })

  readonly fetchRules = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$]),
      switchMap(([_, leaderboardUid]) =>
        this.ruleService.getRules(leaderboardUid).pipe(
          tapResponse({
            next: (rulesResponse) => this.patchState({ rules: rulesResponse.rules }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchAdmin = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.adminService.validate().pipe(
          tapResponse({
            next: () => this.patchState({ isAdmin: true }),
            error: () => this.patchState({ isAdmin: false }),
          }),
        ),
      ),
    )
  })

  readonly updateAdmin = this.effect<string>((key$) => {
    return key$.pipe(
      tap((key) => {
        this.adminService.save(key)
        this.logService.success('Success', 'Saved admin key')
        return this.fetchAdmin()
      }),
    )
  })

  readonly updateWeeklyMaps = this.updater((state, [weeklyId, maps]: [string, Array<Map>]) => ({
    ...state,
    weeklies: {
      ...state.weeklies,
      [weeklyId]: {
        ...(state.weeklies[weeklyId] ?? {}),
        maps,
      },
    },
  }))

  readonly fetchWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      switchMap((weeklyId) =>
        this.weeklyService.getWeeklyMaps(weeklyId).pipe(
          tapResponse({
            next: (maps) => this.updateWeeklyMaps([weeklyId, maps]),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly addWeeklyMap = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([weeklyId, mapUid]) =>
        this.weeklyService.addWeeklyMap(weeklyId, mapUid).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added map: ${mapUid} to weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchWeekly(weeklyId),
          }),
        ),
      ),
    )
  })

  readonly createWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      switchMap((weeklyId) =>
        this.weeklyService.createWeekly(weeklyId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Created new weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly publishWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$]),
      switchMap(([weeklyId, leaderboardUid]) =>
        this.leaderboardService.addWeeklyToLeaderboard(leaderboardUid, weeklyId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Published weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly addMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) =>
        this.matchService.addMatchResult(matchId, accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added match result: ${matchId}, ${accountId}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly updateMatchResult = this.effect<[string, string, number]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId, score]) =>
        this.matchService.updateMatchResult(matchId, accountId, score).pipe(
          tapResponse({
            next: () =>
              this.logService.success('Success', `Updated match result: ${matchId}, ${accountId}, ${score}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly deleteMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) =>
        this.matchService.deleteMatchResult(matchId, accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Deleted match result: ${matchId}, ${accountId}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly addPlayer = this.effect<string>((accountId$) => {
    return accountId$.pipe(
      switchMap((accountId) =>
        this.playerService.addPlayer(accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added player: ${accountId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchPlayers(),
          }),
        ),
      ),
    )
  })

  readonly fetchMaps = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.mapService.listMap().pipe(
          tapResponse({
            next: (maps) => this.patchState({ maps: maps.sort((mapA, mapB) => mapA.name.localeCompare(mapB.name)) }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly addMap = this.effect<string>((mapUid$) => {
    return mapUid$.pipe(
      switchMap((mapUid) =>
        this.mapService.addMap(mapUid).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added map: ${mapUid}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchMaps(),
          }),
        ),
      ),
    )
  })

  readonly updateNemesisWeights = this.updater((state, weights: StoreState['nemesisWeights']) => ({
    ...state,
    nemesisWeights: {
      ...state.nemesisWeights,
      ...weights,
    },
  }))

  readonly fetchFeatureToggles = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      map(() => {
        const featureToggles = this.featureService.getAll()
        return this.patchState({ featureToggles })
      }),
    )
  })

  readonly toggleFeature = this.effect<FeatureToggle>((feature$) => {
    return feature$.pipe(
      tap((feature) => {
        this.featureService.toggle(feature)
        this.fetchFeatureToggles()
      }),
    )
  })

  readonly fetchOrganizations = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.organizationService.getAll().pipe(
          tapResponse({
            next: (res) => {
              // this.patchState({ organizations: res.organizations })
              if (this.state().selectedOrganization == 0) {
                const organization = res.organizations.find((o) => o.name === 'Holy Dynasty')
                if (!organization) return

                this.patchState({ selectedOrganization: organization.organizationId })
                this.fetchTeams(organization.organizationId)
                this.fetchTags(organization.organizationId)
                this.fetchTeamRoles(organization.organizationId)
                this.fetchPosts(organization.organizationId)
                this.fetchEvents(organization.organizationId)
              }
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchTeamRoles = this.effect<Organization['organizationId']>((organizationId$) => {
    return organizationId$.pipe(
      switchMap((organizationId) =>
        this.teamRoleService.getAll(organizationId).pipe(
          tapResponse({
            next: (res) => this.patchState({ teamRoles: res.teamRoles }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchTags = this.effect<Organization['organizationId']>((organizationId$) => {
    return organizationId$.pipe(
      switchMap((organizationId) =>
        this.tagService.getAll(organizationId).pipe(
          tapResponse({
            next: (res) => this.patchState({ tags: res.tags }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchTeams = this.effect<Organization['organizationId']>((organizationId$) => {
    return organizationId$.pipe(
      switchMap((organizationId) =>
        this.teamService.getAll(organizationId).pipe(
          tapResponse({
            next: (res) => this.patchState({ teams: res.teams }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  private addTeamPlayer = ({ team, player }: { team: Team; player: TeamPlayer }) => {
    return this.teamService.addPlayer(team, player).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Added player ${player.name} to team: ${team.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private updateTeamPlayer = ({ team, player }: { team: Team; player: TeamPlayer }) => {
    return this.teamService.updatePlayer(team, player).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Updated player ${player.name} in team: ${team.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private deleteTeamPlayer = ({ team, player }: { team: Team; player: TeamPlayer }) => {
    return this.teamService.deletePlayer(team, player.accountId).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Deleted player ${player.name} from team: ${team.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  readonly upsertTeam = this.effect<Team>((team$) => {
    return team$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$, this.teams$]),
      switchMap(([team, selectedOrganization, teams]) => {
        team = { ...team, organizationId: selectedOrganization }

        const existingTeam = teams.find((t) => t.teamId === team.teamId)

        if (existingTeam) {
          const existingPlayerIds = new Set(existingTeam.players.map((p) => p.accountId))
          const newPlayerIds = new Set(team.players.map((p) => p.accountId))

          const playersToAdd = team.players.filter((p) => !existingPlayerIds.has(p.accountId))
          const playersToUpdate = team.players.filter((p) => existingPlayerIds.has(p.accountId))
          const playersToRemove = existingTeam.players.filter((p) => !newPlayerIds.has(p.accountId))

          return this.teamService.update(team).pipe(
            tapResponse({
              next: () => this.logService.success('Success', `Updated team: ${team.name}`, false),
              error: (error: HttpErrorResponse) => this.logService.error(error),
            }),
            switchMap(() =>
              from([
                ...(playersToAdd.length > 0
                  ? [from(playersToAdd).pipe(mergeMap((player) => this.addTeamPlayer({ team, player })))]
                  : []),
                ...(playersToUpdate.length > 0
                  ? [from(playersToUpdate).pipe(mergeMap((player) => this.updateTeamPlayer({ team, player })))]
                  : []),
                ...(playersToRemove.length > 0
                  ? [from(playersToRemove).pipe(mergeMap((player) => this.deleteTeamPlayer({ team, player })))]
                  : []),
              ]).pipe(
                mergeMap((obs$) => obs$),
                defaultIfEmpty(null),
              ),
            ),
            last(),
            tap(() => this.logService.success('Success', `Updated team: ${team.name}`)),
            tap(() => this.fetchTeams(selectedOrganization)),
          )
        }

        return this.teamService.create(team).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Created team: ${team.name}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchTeams(selectedOrganization),
          }),
          switchMap((teamResponse) =>
            team.players.length > 0
              ? from(team.players).pipe(
                  mergeMap((player) => this.addTeamPlayer({ team: teamResponse.team, player })),
                  defaultIfEmpty(null),
                )
              : of(null),
          ),
          last(),
          tap(() => this.logService.success('Success', `Created team: ${team.name}`)),
          tap(() => this.fetchEvents(selectedOrganization)),
        )
      }),
    )
  })

  readonly deleteTeam = this.effect<Team>((team$) => {
    return team$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$]),
      switchMap(([team, selectedOrganization]) => {
        team = { ...team, organizationId: selectedOrganization }

        const deletePlayers$ =
          team.players && team.players.length > 0
            ? from(team.players).pipe(
                mergeMap((player) => this.deleteTeamPlayer({ team, player })),
                defaultIfEmpty(null),
                last(),
              )
            : of(null)

        return deletePlayers$.pipe(
          switchMap(() =>
            this.teamService.delete(team).pipe(
              tapResponse({
                next: () => this.logService.success('Success', `Deleted team: ${team.name}`),
                error: (error: HttpErrorResponse) => this.logService.error(error),
                finalize: () => this.fetchTeams(selectedOrganization),
              }),
            ),
          ),
        )
      }),
    )
  })

  readonly fetchPosts = this.effect<Organization['organizationId']>((organizationId$) => {
    return organizationId$.pipe(
      switchMap((organizationId) =>
        this.postService.getAll(organizationId).pipe(
          tapResponse({
            next: (res) => this.patchState({ posts: res.posts.sort((a, b) => a.sortOrder - b.sortOrder) }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchEvents = this.effect<Organization['organizationId']>((organizationId$) => {
    return organizationId$.pipe(
      switchMap((organizationId) =>
        this.eventService.getAll(organizationId).pipe(
          tapResponse({
            next: (res) => {
              this.patchState({ events: res.events })
              res.events.forEach((event) => this.fetchEventEmbed(event.eventId))
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  private addPostTag = ({ post, tag }: { post: Post; tag: Tag }) => {
    return this.postService.addTag(post, tag).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Added tag ${tag.name} to post: ${post.title}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private updatePostTag = ({ post, tag }: { post: Post; tag: Tag }) => {
    return this.postService.updateTag(post, tag).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Updated tag ${tag.name} in post: ${post.title}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private deletePostTag = ({ post, tag }: { post: Post; tag: Tag }) => {
    return this.postService.deleteTag(post, tag).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Deleted tag ${tag.name} from post: ${post.title}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  readonly upsertPost = this.effect<Post>((post$) => {
    return post$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$]),
      switchMap(([post, selectedOrganization]) => {
        post = { ...post, organizationId: selectedOrganization, accountId: post.author?.accountId || '' }

        const existingPost = this.state().posts.find((p) => p.postId === post.postId)

        if (existingPost) {
          const existingPlayerIds = new Set(existingPost.tags.map((p) => p.tagId))
          const newPlayerIds = new Set(post.tags.map((p) => p.tagId))

          const tagsToAdd = post.tags.filter((p) => !existingPlayerIds.has(p.tagId))
          const tagsToUpdate = post.tags.filter((p) => existingPlayerIds.has(p.tagId))
          const tagsToRemove = existingPost.tags.filter((p) => !newPlayerIds.has(p.tagId))

          return this.postService.update(post).pipe(
            tapResponse({
              next: () => this.logService.success('Success', `Updated post: ${post.title}`, false),
              error: (error: HttpErrorResponse) => this.logService.error(error),
            }),
            switchMap(() =>
              from([
                ...(tagsToAdd.length > 0
                  ? [from(tagsToAdd).pipe(mergeMap((tag) => this.addPostTag({ post, tag })))]
                  : []),
                ...(tagsToUpdate.length > 0
                  ? [from(tagsToUpdate).pipe(mergeMap((tag) => this.updatePostTag({ post, tag })))]
                  : []),
                ...(tagsToRemove.length > 0
                  ? [from(tagsToRemove).pipe(mergeMap((tag) => this.deletePostTag({ post, tag })))]
                  : []),
              ]).pipe(
                mergeMap((obs$) => obs$),
                defaultIfEmpty(null),
              ),
            ),
            last(),
            tap(() => this.logService.success('Success', `Updated post: ${post.title}`)),
            tap(() => this.fetchPosts(selectedOrganization)),
          )
        }

        return this.postService.create(post).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Created post: ${post.title}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
          switchMap((postResponse) =>
            post.tags.length > 0
              ? from(post.tags).pipe(
                  mergeMap((tag) => this.addPostTag({ post: postResponse.post, tag })),
                  defaultIfEmpty(null),
                )
              : of(null),
          ),
          last(),
          tap(() => this.logService.success('Success', `Created post: ${post.title}`)),
          tap(() => this.fetchPosts(selectedOrganization)),
        )
      }),
    )
  })

  readonly deletePost = this.effect<Post>((post$) => {
    return post$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$]),
      switchMap(([post, selectedOrganization]) => {
        post = { ...post, organizationId: selectedOrganization }

        const deleteTags$ =
          post.tags && post.tags.length > 0
            ? from(post.tags).pipe(
                mergeMap((tag) => this.deletePostTag({ post, tag })),
                defaultIfEmpty(null),
                last(),
              )
            : of(null)

        return deleteTags$.pipe(
          switchMap(() =>
            this.postService.delete(post).pipe(
              tapResponse({
                next: () => this.logService.success('Success', `Deleted post: ${post.title}`),
                error: (error: HttpErrorResponse) => this.logService.error(error),
                finalize: () => this.fetchPosts(selectedOrganization),
              }),
            ),
          ),
        )
      }),
    )
  })

  private addEventPlayer = ({ event, player }: { event: Event; player: EventPlayer }) => {
    return this.eventService.addPlayer(event, player).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Added player ${player.name} to event: ${event.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private updateEventPlayer = ({ event, player }: { event: Event; player: EventPlayer }) => {
    return this.eventService.updatePlayer(event, player).pipe(
      tapResponse({
        next: () => this.logService.success('Success', `Updated player ${player.name} in event: ${event.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  private deleteEventPlayer = ({ event, player }: { event: Event; player: EventPlayer }) => {
    return this.eventService.deletePlayer(event, player.accountId).pipe(
      tapResponse({
        next: () =>
          this.logService.success('Success', `Deleted player ${player.name} from event: ${event.name}`, false),
        error: (error: HttpErrorResponse) => this.logService.error(error),
      }),
    )
  }

  readonly upsertEvent = this.effect<Event>((event$) => {
    return event$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$, this.events$]),
      switchMap(([event, selectedOrganization, events]) => {
        event = { ...event, organizationId: selectedOrganization }

        const existingEvent = events.find((e) => e.eventId === event.eventId)

        if (existingEvent) {
          const existingPlayerIds = new Set(existingEvent.players.map((p) => p.accountId))
          const newPlayerIds = new Set(event.players.map((p) => p.accountId))

          const playersToAdd = event.players.filter((p) => !existingPlayerIds.has(p.accountId))
          const playersToUpdate = event.players.filter((p) => existingPlayerIds.has(p.accountId))
          const playersToRemove = existingEvent.players.filter((p) => !newPlayerIds.has(p.accountId))

          return this.eventService.update(event).pipe(
            tapResponse({
              next: () => this.logService.success('Success', `Updated event: ${event.name}`, false),
              error: (error: HttpErrorResponse) => this.logService.error(error),
            }),
            switchMap(() =>
              from([
                ...(playersToAdd.length > 0
                  ? [from(playersToAdd).pipe(mergeMap((player) => this.addEventPlayer({ event, player })))]
                  : []),
                ...(playersToUpdate.length > 0
                  ? [from(playersToUpdate).pipe(mergeMap((player) => this.updateEventPlayer({ event, player })))]
                  : []),
                ...(playersToRemove.length > 0
                  ? [from(playersToRemove).pipe(mergeMap((player) => this.deleteEventPlayer({ event, player })))]
                  : []),
              ]).pipe(
                mergeMap((obs$) => obs$),
                defaultIfEmpty(null),
              ),
            ),
            last(),
            tap(() => this.logService.success('Success', `Updated event: ${event.name}`)),
            tap(() => this.fetchEvents(selectedOrganization)),
          )
        }

        return this.eventService.create(event).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Created event: ${event.name}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
          switchMap((eventResponse) =>
            event.players.length > 0
              ? from(event.players).pipe(
                  mergeMap((player) => this.addEventPlayer({ event: eventResponse.event, player })),
                  defaultIfEmpty(null),
                )
              : of(null),
          ),
          last(),
          tap(() => this.logService.success('Success', `Created event: ${event.name}`)),
          tap(() => this.fetchEvents(selectedOrganization)),
        )
      }),
    )
  })

  readonly deleteEvent = this.effect<Event>((event$) => {
    return event$.pipe(
      concatLatestFrom(() => [this.selectedOrganization$]),
      switchMap(([event, selectedOrganization]) => {
        event = { ...event, organizationId: selectedOrganization }

        const deletePlayers$ =
          event.players.length > 0
            ? from(event.players).pipe(
                mergeMap((player) => this.deleteEventPlayer({ event, player })),
                defaultIfEmpty(null),
                last(),
              )
            : of(null)

        return deletePlayers$.pipe(
          switchMap(() =>
            this.eventService.delete(event).pipe(
              tapResponse({
                next: () => this.logService.success('Success', `Deleted event: ${event.name}`),
                error: (error: HttpErrorResponse) => this.logService.error(error),
                finalize: () => this.fetchEvents(selectedOrganization),
              }),
            ),
          ),
        )
      }),
    )
  })

  readonly fetchPlayers = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.playerService.getAllPlayers().pipe(
          tapResponse({
            next: (res) => {
              res.sort((playerA, playerB) => {
                if (playerA.name == playerB.name) return playerA.accountId.localeCompare(playerB.accountId)
                return playerA.name.localeCompare(playerB.name)
              })
              this.patchState({ players: res })
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly fetchEventEmbed = this.effect<Event['eventId']>((eventId$) => {
    return eventId$.pipe(
      mergeMap((eventId) =>
        this.eventService.getEmbed(eventId).pipe(
          tapResponse({
            next: (embedResponse) => {
              if (embedResponse) {
                this.patchState((state) => ({
                  eventEmbeds: {
                    ...state.eventEmbeds,
                    [eventId]: embedResponse,
                  },
                }))
              }
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly deleteEventEmbed = this.effect<Event['eventId']>((eventId$) => {
    return eventId$.pipe(
      switchMap((eventId) =>
        this.eventService.deleteEmbed(eventId).pipe(
          tapResponse({
            next: () => {
              this.patchState((state) => {
                const { [eventId]: _, ...eventEmbeds } = state.eventEmbeds
                return { eventEmbeds }
              })
              this.logService.success('Success', `Deleted embed for event: ${eventId}`, false)
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchEventEmbed(eventId),
          }),
        ),
      ),
    )
  })
}
