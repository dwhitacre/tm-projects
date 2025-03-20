package domain

import (
	"context"
	"errors"
	"slices"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

type Leaderboard struct {
	LeaderboardId string 		`json:"leaderboardId"`
	Tops        	[]*Top 		`json:"tops"`
	Playercount 	int   		`json:"playercount"`
	Weeklies			[]*LeaderboardWeekly `json:"weeklies"`
	LastModified  string 		`json:"lastModified"`
	Players				[]*Player `json:"players"`
	CampaignId		string		`json:"campaignId"`
	ClubId				string		`json:"clubId"`
}

type LeaderboardWeekly struct {
	Weekly 			*Weekly `json:"weekly"`
	Published   bool		`json:"published"`
}

type Top struct {
	Player   *Player `json:"player"`
	Score    int     `json:"score"`
	Position int     `json:"position"`
}

type LeaderboardData struct {
	LeaderboardId string
	LastModified string
	WeeklyId string
	Published bool
	ClubId string
	CampaignId string
}

func getLeaderboardData(leaderboardId string) ([]LeaderboardData, error) {
	var leaderboardData []LeaderboardData

	rows, err := db.Query(
		context.Background(),
		`select l.LeaderboardId, l.LastModified, lw.WeeklyId, TRUE as Published, l.ClubId, l.CampaignId
			from Leaderboard l
			join LeaderboardWeekly lw on l.leaderboardId = lw.LeaderboardId
			where l.LeaderboardId=$1`,
		leaderboardId,
	)
	if err != nil {
		return leaderboardData, err
	}

	leaderboardData, err = pgx.CollectRows(rows, pgx.RowToStructByName[LeaderboardData])
	if err != nil {
		return leaderboardData, err
	}

	return leaderboardData, nil
}

func getUnpublishedLeaderboardData() ([]LeaderboardData, error) {
	leaderboardData := []LeaderboardData{}

	rows, err := db.Query(
		context.Background(),
		`select '' as LeaderboardId, '' as LastModified, w.WeeklyId, FALSE as Published, '' as ClubId, '' as CampaignId
			from Weekly w
			left join LeaderboardWeekly lw on lw.weeklyid = w.weeklyid
			where leaderboardweeklyid is null`,
	)
	if err != nil {
		return leaderboardData, err
	}

	leaderboardData, err = pgx.CollectRows(rows, pgx.RowToStructByName[LeaderboardData])
	if err != nil {
		return leaderboardData, err
	}

	return leaderboardData, nil
}

func toLeaderboard(leaderboardData []LeaderboardData, leaderboard *Leaderboard) error {
	if len(leaderboardData) < 1 {
		return errors.New("LeaderboardGet: no leaderboardData to create leaderboard from")
	}

	leaderboard.LeaderboardId = leaderboardData[0].LeaderboardId
	leaderboard.LastModified = leaderboardData[0].LastModified
	leaderboard.CampaignId = leaderboardData[0].CampaignId
	leaderboard.ClubId = leaderboardData[0].ClubId

	for i := 0; i < len(leaderboardData); i++ {
		var weekly Weekly
		weekly.WeeklyId = leaderboardData[i].WeeklyId
		err := WeeklyGet(&weekly)
		if err != nil {
			return err
		}

		var leaderboardWeekly LeaderboardWeekly
		leaderboardWeekly.Weekly = &weekly
		leaderboardWeekly.Published = leaderboardData[i].Published
		leaderboard.Weeklies = append(leaderboard.Weeklies, &leaderboardWeekly)

		for j := 0; j < len(leaderboard.Weeklies[i].Weekly.Results); j++ {
			idx := slices.IndexFunc(leaderboard.Tops, func (top *Top) bool {
				return top.Player.AccountId == leaderboard.Weeklies[i].Weekly.Results[j].Player.AccountId
			})
			if idx == -1 {
				var top Top
				top.Player = leaderboard.Weeklies[i].Weekly.Results[j].Player
				idx = len(leaderboard.Tops)
				leaderboard.Tops = append(leaderboard.Tops, &top)
			}
			leaderboard.Tops[idx].Score += leaderboard.Weeklies[i].Weekly.Results[j].Score
		}
	}

	return nil
}

func LeaderboardGet(leaderboard *Leaderboard, published bool) error {
	if leaderboard.LeaderboardId == "" {
		return errors.New("LeaderboardGet: missing leaderboardId, nothing to gets")
	}

	leaderboardData, err := getLeaderboardData(leaderboard.LeaderboardId)
	if err != nil {
		return err
	}

	if !published {
		unpublishedLeaderboardData, err := getUnpublishedLeaderboardData()
		if err != nil {
			return err
		}

		leaderboardData = append(leaderboardData, unpublishedLeaderboardData...)
	}

	err = toLeaderboard(leaderboardData, leaderboard)
	if err != nil {
		return err
	}

	slices.SortFunc(leaderboard.Tops, func (topA *Top, topB *Top) int {
		if topB.Score == topA.Score {
			return strings.Compare(strings.ToLower(topA.Player.Name), strings.ToLower(topB.Player.Name))
		}
		return topB.Score - topA.Score
	})

	for i := 0; i < len(leaderboard.Tops); i++ {
		if i > 0 && leaderboard.Tops[i].Score == leaderboard.Tops[i-1].Score {
			leaderboard.Tops[i].Position = leaderboard.Tops[i-1].Position
		} else {
			leaderboard.Tops[i].Position = i + 1
		}
		leaderboard.Playercount++
	}

	return nil
}

func LeaderboardUpdate(leaderboardId string) error {
	_, err := db.Exec(
		context.Background(),
		`update leaderboard set LastModified = $2 where LeaderboardId = $1`,
		leaderboardId,
		time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return err
	}

	return nil
}

func LeaderboardUpdateFromMatchId(matchId string) error {
	_, err := db.Exec(
		context.Background(),
		`update leaderboard l
			set lastmodified = $2
			from leaderboardweekly lw
				join weeklymatch wm on lw.weeklyid = wm.weeklyid
			where
				l.leaderboardid = lw.leaderboardid
				and wm.matchid = $1`,
		matchId,
		time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return err
	}

	return nil
}

func LeaderboardWeeklyAdd(leaderboardId string, weeklyId string) error {
	_, err := db.Exec(
		context.Background(),
		`insert into leaderboardweekly (LeaderboardId, WeeklyId) values ($1, $2)`,
		leaderboardId,
		weeklyId,
	)
	if err != nil {
		return err
	}

	return nil
}