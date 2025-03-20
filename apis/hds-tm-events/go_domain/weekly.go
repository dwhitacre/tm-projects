package domain

import (
	"context"
	"errors"
	"slices"

	"github.com/jackc/pgx/v5"
)

type Weekly struct {
	WeeklyId  string 					`json:"weeklyId"`
	Matches   []*WeeklyMatch 	`json:"matches"`
	Results 	[]*WeeklyResult `json:"results"`
}

type WeeklyMatch struct {
	Match *Match `json:"match"`
}

type WeeklyResult struct {
	Player 		*Player `json:"player"`
	Score 		int 		`json:"score"`
	Position 	int			`json:"position"`
}

type WeeklyData struct {
	WeeklyId string
	MatchId string
}

type WeeklyMapData struct {
	MapUid string
}

func getWeeklyMapData(weeklyId string) ([]WeeklyMapData, error) {
	var weeklyMapData []WeeklyMapData

	rows, err := db.Query(
		context.Background(),
		`select wm.MapUid
			from Weekly w
			join WeeklyMap wm on w.WeeklyId = wm.WeeklyId
			where w.WeeklyId=$1`,
		weeklyId,
	)
	if err != nil {
		return weeklyMapData, err
	}

	weeklyMapData, err = pgx.CollectRows(rows, pgx.RowToStructByName[WeeklyMapData])
	if err != nil {
		return weeklyMapData, err
	}

	return weeklyMapData, nil
}

func getWeeklyData(weeklyId string) ([]WeeklyData, error) {
	var weeklyData []WeeklyData

	rows, err := db.Query(
		context.Background(),
		`select w.WeeklyId, wm.MatchId
			from Weekly w
			join WeeklyMatch wm on w.WeeklyId = wm.WeeklyId
			where w.WeeklyId=$1`,
		weeklyId,
	)
	if err != nil {
		return weeklyData, err
	}

	weeklyData, err = pgx.CollectRows(rows, pgx.RowToStructByName[WeeklyData])
	if err != nil {
		return weeklyData, err
	}

	return weeklyData, nil
}

func toWeekly(weeklyData []WeeklyData, weekly *Weekly) error {
	if len(weeklyData) < 1 {
		return errors.New("WeeklyGet: no weeklyData to create weekly from")
	}

	weekly.WeeklyId = weeklyData[0].WeeklyId
	weekly.Results = []*WeeklyResult{}

	for i := 0; i < len(weeklyData); i++ {
		var match Match
		match.MatchId = weeklyData[i].MatchId
		err := MatchGet(&match)
		if err != nil {
			return err
		}

		var weeklyMatch WeeklyMatch
		weeklyMatch.Match = &match
		weekly.Matches = append(weekly.Matches, &weeklyMatch)

		for j := 0; j < len(weekly.Matches[i].Match.PointsResults); j++ {
			idx := slices.IndexFunc(weekly.Results, func (weeklyResult *WeeklyResult) bool {
				return weeklyResult.Player.AccountId == weekly.Matches[i].Match.PointsResults[j].Player.AccountId
			})
			if idx == -1 {
				var weeklyResult WeeklyResult
				weeklyResult.Player = weekly.Matches[i].Match.PointsResults[j].Player
				idx = len(weekly.Results)
				weekly.Results = append(weekly.Results, &weeklyResult)
			}
			weekly.Results[idx].Score += weekly.Matches[i].Match.PointsResults[j].Score
		}
	}

	return nil
}

func WeeklyGet(weekly *Weekly) error {
	if weekly.WeeklyId == "" {
		return errors.New("WeeklyGet: missing weekly id, nothing to gets")
	}

	weeklyData, err := getWeeklyData(weekly.WeeklyId)
	if err != nil {
		return err
	}

	err = toWeekly(weeklyData, weekly)
	if err != nil {
		return err
	}

	slices.SortFunc(weekly.Results, func (weeklyResultA *WeeklyResult, weeklyResultB *WeeklyResult) int {
		return weeklyResultB.Score - weeklyResultA.Score
	})

	for i := 0; i < len(weekly.Results); i++ {
		if i > 0 && weekly.Results[i].Score == weekly.Results[i-1].Score {
			weekly.Results[i].Position = weekly.Results[i-1].Position
		} else {
			weekly.Results[i].Position = i + 1
		}
	}

	return nil
}

func getWeeklyMatches(weeklyId string) []Match {
	return []Match{
		{
			MatchId: weeklyId + "-finals",
			PointsAwarded: 4,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-semifinal-a",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-semifinal-b",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-semifinal-tiebreak",
			PointsAwarded: 2,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-a",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-b",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-c",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-d",
			PointsAwarded: 5,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-tiebreak-a",
			PointsAwarded: 3,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-tiebreak-b",
			PointsAwarded: 2,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-quarterfinal-tiebreak-c",
			PointsAwarded: 1,
			PlayersAwarded: 1,
		},
		{
			MatchId: weeklyId + "-qualifying",
			PointsAwarded: 1,
			PlayersAwarded: 8,
		},
	}
}

func WeeklyAdd(weekly *Weekly) error {
	if weekly.WeeklyId == "" {
		return errors.New("WeeklyAdd: missing weekly id, nothing to create")
	}

	_, err := db.Exec(
		context.Background(),
		`insert into weekly (WeeklyId) values ($1)`,
		weekly.WeeklyId,
	)
	if err != nil {
		return err
	}

	weeklyMatches := getWeeklyMatches(weekly.WeeklyId)
	for i := 0; i < len(weeklyMatches); i++ {
		if err := MatchAdd(&weeklyMatches[i]); err != nil {
			return err
		}
		if err := WeeklyMatchAdd(weekly.WeeklyId, weeklyMatches[i].MatchId); err != nil {
			return err
		}
	}

	return nil
}

func WeeklyMatchAdd(weeklyId string, matchId string) error {
	_, err := db.Exec(
		context.Background(),
		`insert into weeklymatch (WeeklyId, MatchId) values ($1, $2)`,
		weeklyId,
		matchId,
	)
	if err != nil {
		return err
	}

	return nil
}

func WeeklyMapList(weeklyId string) ([]*Map, error) {
	maps := []*Map{}

	weeklyMapData, err := getWeeklyMapData(weeklyId)
	if err != nil {
		return maps, err
	}

	for i := 0; i < len(weeklyMapData); i++ {
		var m Map
		m.MapUid = weeklyMapData[i].MapUid

		if err = MapGet(&m); err != nil {
			return maps, err;
		}

		maps = append(maps, &m)
	}

	return maps, nil
}

func WeeklyMapAdd(weeklyId string, mapUid string) error {
	_, err := db.Exec(
		context.Background(),
		`insert into weeklymap (WeeklyId, MapUid) values ($1, $2)`,
		weeklyId,
		mapUid,
	)
	if err != nil {
		return err
	}

	return nil
}

func WeeklyMapDelete(weeklyId string, mapUid string) error {
	_, err := db.Exec(
		context.Background(),
		`delete from weeklymap where WeeklyId = $1 and MapUid = $2`,
		weeklyId,
		mapUid,
	)
	if err != nil {
		return err
	}

	return nil
}

