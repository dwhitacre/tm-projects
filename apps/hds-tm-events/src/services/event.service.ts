import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EventResponse } from 'src/domain/event'
import { TeamRole } from 'src/domain/team'

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private _: HttpClient) {}

  getAll(): Observable<EventResponse> {
    return of({
      events: [
        {
          name: 'Trackmania World Championship 2025',
          description: 'The most prestigious Trackmania event of the year.',
          dateStart: new Date('2025-06-10'),
          dateEnd: new Date('2025-06-20'),
          externalUrl: 'https://trackmania.io/world-championship-2025',
          image: 'assets/images/tmwc2025.png',
          visible: true,
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          sortOrder: 1,
          players: [
            {
              id: 'player1',
              name: 'SpeedyRacer',
              role: TeamRole.PLAYER,
              eventRole: TeamRole.PLAYER,
              accountId: 'acc1',
              image: 'assets/images/player1.png',
              twitch: 'speedyracer',
              discord: 'speedyracer#1234',
            },
            {
              id: 'player2',
              name: 'TurboMaster',
              role: TeamRole.CAPTAIN,
              eventRole: TeamRole.CAPTAIN,
              accountId: 'acc2',
              image: 'assets/images/player2.png',
              twitch: 'turbomaster',
              discord: 'turbomaster#5678',
            },
          ],
        },
        {
          name: 'Trackmania Summer League',
          description: 'A summer-long league for Trackmania enthusiasts.',
          dateStart: new Date('2025-07-01'),
          dateEnd: new Date('2025-08-31'),
          externalUrl: 'https://trackmania.io/summer-league-2025',
          visible: true,
          sortOrder: 2,
          players: [
            {
              id: 'player3',
              name: 'DriftKing',
              role: TeamRole.PLAYER,
              eventRole: TeamRole.PLAYER,
              accountId: 'acc3',
              image: 'assets/images/player3.png',
              twitch: 'driftking',
              discord: 'driftking#9101',
            },
            {
              id: 'player4',
              name: 'NitroBlaster',
              role: TeamRole.SUBSTITUTE,
              eventRole: TeamRole.SUBSTITUTE,
              accountId: 'acc4',
              image: 'assets/images/player4.png',
              twitch: 'nitroblaster',
              discord: 'nitroblaster#1121',
            },
          ],
        },
        {
          name: 'Trackmania Community Cup',
          description: 'A community-organized event for casual and competitive players.',
          dateStart: new Date('2025-05-15'),
          externalUrl: 'https://trackmania.io/community-cup-2025',
          visible: true,
          sortOrder: 3,
          players: [
            {
              id: 'player5',
              name: 'LoopMaster',
              role: TeamRole.PLAYER,
              eventRole: TeamRole.PLAYER,
              accountId: 'acc5',
              image: 'assets/images/player5.png',
              twitch: 'loopmaster',
              discord: 'loopmaster#3141',
            },
          ],
        },
        {
          name: 'Trackmania Winter Invitational',
          description: 'An invitational event for the top Trackmania players.',
          dateStart: new Date('2025-12-01'),
          dateEnd: new Date('2025-12-05'),
          externalUrl: 'https://trackmania.io/winter-invitational-2025',
          visible: false,
          sortOrder: 4,
          players: [
            {
              id: 'player6',
              name: 'IceDrifter',
              role: TeamRole.PLAYER,
              eventRole: TeamRole.PLAYER,
              accountId: 'acc6',
              image: 'assets/images/player6.png',
              twitch: 'icedrifter',
              discord: 'icedrifter#5161',
            },
            {
              id: 'player7',
              name: 'SnowRacer',
              role: TeamRole.CASTER,
              eventRole: TeamRole.CASTER,
              accountId: 'acc7',
              image: 'assets/images/player7.png',
              twitch: 'snowracer',
              discord: 'snowracer#7181',
            },
          ],
        },
        {
          name: 'Trackmania Weekly Challenge',
          externalUrl: 'https://trackmania.io/weekly-challenge',
          visible: true,
          sortOrder: 5,
          players: [],
        },
      ],
    })
  }
}
