import type { Db } from "./db";
import { Weekly, WeeklyResult } from "../domain/weekly";
import Match from "../domain/match";
import Map from "../domain/map";

export class WeeklyService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  getWeeklyMatches(weeklyId: Weekly["weeklyId"]): Array<Match> {
    return [
      { matchId: `${weeklyId}-finals`, pointsAwarded: 4, playersAwarded: 1 },
      {
        matchId: `${weeklyId}-semifinal-a`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-semifinal-b`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-semifinal-tiebreak`,
        pointsAwarded: 2,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-a`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-b`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-c`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-d`,
        pointsAwarded: 5,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-tiebreak-a`,
        pointsAwarded: 3,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-tiebreak-b`,
        pointsAwarded: 2,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-quarterfinal-tiebreak-c`,
        pointsAwarded: 1,
        playersAwarded: 1,
      },
      {
        matchId: `${weeklyId}-qualifying`,
        pointsAwarded: 1,
        playersAwarded: 8,
      },
    ].map((jsonObject) => Match.fromJson(jsonObject));
  }

  async get(weeklyId: Weekly["weeklyId"]): Promise<Weekly | undefined> {
    const result = await this.db.selectOne(
      `
        select WeeklyId
        from Weekly 
        where WeeklyId = $1
      `,
      [weeklyId]
    );

    return result ? Weekly.fromJson(result) : result;
  }

  async insert(weekly: Weekly) {
    const matches = this.getWeeklyMatches(weekly.weeklyId);
    const matchValues = matches
      .map(
        (_, idx) => `(\$${idx * 3 + 1}, \$${idx * 3 + 2}, \$${idx * 3 + 3}),`
      )
      .join(" ")
      .slice(0, -1);
    const weeklyMatchValues = matches
      .map((_, idx) => `($1, \$${idx + 2}),`)
      .join(" ")
      .slice(0, -1);

    const matchParams = matches.flatMap((match) => [
      match.matchId,
      match.playersAwarded,
      match.pointsAwarded,
    ]);
    const weeklyMatchParams = [
      weekly.weeklyId,
      ...matches.map((match) => match.matchId),
    ];

    return this.db.transaction([
      [
        `
          insert into Weekly (WeeklyId)
          values ($1)
        `,
        [weekly.weeklyId],
      ],
      [
        `
          insert into Match (MatchId, PlayersAwarded, PointsAwarded)
          values ${matchValues}
        `,
        matchParams,
      ],
      [
        `
          insert into WeeklyMatch (WeeklyId, MatchId)
          values ${weeklyMatchValues};
        `,
        weeklyMatchParams,
      ],
    ]);
  }

  async getMaps(weekly: Weekly) {
    const result = await this.db.select(
      `
        select
          Weekly.WeeklyId,
          Map.MapUid,
          Map.TmioData
        from Weekly
        join WeeklyMap on Weekly.WeeklyId = WeeklyMap.WeeklyId
        join Map on WeeklyMap.MapUid = Map.MapUid
        where Weekly.WeeklyId = $1
      `,
      [weekly.weeklyId]
    );

    return result.map(Map.fromJson);
  }

  async insertMap(weekly: Weekly, map: Map) {
    return this.db.insert(
      `
        insert into WeeklyMap (WeeklyId, MapUid)
        values ($1, $2)
      `,
      [weekly.weeklyId, map.mapUid]
    );
  }

  async deleteMap(weekly: Weekly, map: Map) {
    return this.db.delete(
      `
        delete from WeeklyMap
        where WeeklyId = $1 and MapUid = $2
      `,
      [weekly.weeklyId, map.mapUid]
    );
  }
}

export default (db: Db) => new WeeklyService(db);
