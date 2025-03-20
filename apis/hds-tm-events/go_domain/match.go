package domain

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

type Match struct {
	MatchId   			string 					`json:"matchId"`
	Results   			[]*MatchResult 	`json:"results"`
	PlayersAwarded 	int 						`json:"playersAwarded"`
	PointsAwarded 	int 						`json:"pointsAwarded"`
	PointsResults		[]*MatchResult	`json:"pointsResults"`
}

type MatchResult struct {
	Player 	*Player `json:"player"`
	Score 	int 		`json:"score"`
}

type MatchData struct {
	MatchId string
	PlayersAwarded int
	PointsAwarded int
	AccountId *string
	Score *int
}

type MatchResultData struct {
	AccountId string
	Score int
}

func getMatchData(matchId string) ([]MatchData, error) {
	var matchData []MatchData

	rows, err := db.Query(
		context.Background(),
		`select m.MatchId, m.PlayersAwarded, m.PointsAwarded, mr.AccountId, mr.Score
			from Match m
			left join MatchResult mr on m.MatchId = mr.MatchId
			where m.MatchId=$1
			order by mr.Score desc`,
		matchId,
	)
	if err != nil {
		return matchData, err
	}

	matchData, err = pgx.CollectRows(rows, pgx.RowToStructByNameLax[MatchData])
	if err != nil {
		return matchData, err
	}

	return matchData, nil
}

func toMatch(matchData []MatchData, match *Match) error {
	if len(matchData) < 1 {
		return errors.New("MatchGet: no matchdata to create match from")
	}

	match.MatchId = matchData[0].MatchId
	match.PlayersAwarded = matchData[0].PlayersAwarded
	match.PointsAwarded = matchData[0].PointsAwarded
	match.Results = []*MatchResult{}
	match.PointsResults = []*MatchResult{}

	for i := 0; i < len(matchData); i++ {
		if matchData[i].AccountId != nil {
			var player Player
			player.AccountId = *matchData[i].AccountId
			err := PlayerGet(&player)
			if err != nil {
				return err
			}
	
			var matchResult MatchResult
			matchResult.Player = &player	
			if matchData[i].Score != nil {
				matchResult.Score = *matchData[i].Score
			}
	
			match.Results = append(match.Results, &matchResult)
	
			var pointResult MatchResult
			pointResult.Player = &player
			if i < match.PlayersAwarded && matchResult.Score > 0 {
				pointResult.Score = match.PointsAwarded
			}
	
			match.PointsResults = append(match.PointsResults, &pointResult)
		}
	}

	return nil
}

func MatchGet(match *Match) error {
	if match.MatchId == "" {
		return errors.New("MatchGet: missing match id, nothing to gets")
	}

	matchData, err := getMatchData(match.MatchId)
	if err != nil {
		return err
	}

	err = toMatch(matchData, match)
	if err != nil {
		return err
	}

	return nil
}

func MatchAdd(match *Match) error {
	if match.MatchId == "" {
		return errors.New("MatchAdd: missing match id, nothing to create")
	}

	_, err := db.Exec(
		context.Background(),
		`insert into match (MatchId, PlayersAwarded, PointsAwarded) values ($1, $2, $3)`,
		match.MatchId,
		match.PlayersAwarded,
		match.PointsAwarded,
	)
	if err != nil {
		return err
	}

	return nil
}

func MatchResultAdd(matchId string, accountId string, score int) error {
	_, err := db.Exec(
		context.Background(),
		`insert into matchresult (MatchId, AccountId, Score) values ($1, $2, $3)`,
		matchId,
		accountId,
		score,
	)
	if err != nil {
		return err
	}

	return nil
}

func MatchResultUpdate(matchId string, accountId string, score int) error {
	_, err := db.Exec(
		context.Background(),
		`update matchresult set Score = $3 where MatchId = $1 and AccountId = $2`,
		matchId,
		accountId,
		score,
	)
	if err != nil {
		return err
	}

	return nil
}

func MatchResultDelete(matchId string, accountId string) error {
		_, err := db.Exec(
		context.Background(),
		`delete from matchresult where MatchId = $1 and AccountId = $2`,
		matchId,
		accountId,
	)
	if err != nil {
		return err
	}

	return nil
}

