package domain

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
)

type Player struct {
	AccountId string `json:"accountId"`
	Name      string `json:"name"`
	Image     string `json:"image"`
	Twitch    string `json:"twitch"`
	Discord   string `json:"discord"`
}

type PlayerData struct {
	AccountId string `json:"accountId"`
	DisplayName string `json:"displayname"`
	Trophies *PlayerDataTrophy `json:"trophies"`
}

type PlayerDataTrophy struct {
	Zone *PlayerDataZone `json:"zone"`
}

type PlayerDataZone struct {
	Name string `json:"name"`
	Flag string `json:"flag"`
	Parent *PlayerDataZone `json:"parent"`
}

type PlayerDataDb struct {
	AccountId string `json:"accountId"`
	TmioData string `json:"tmioData"`
}

func getPlayerDataFromDb(accountId string) (PlayerDataDb, error) {
	var player PlayerDataDb

	rows, err := db.Query(
		context.Background(),
		`select AccountId, TmioData from Player where AccountId=$1`,
		accountId,
	)
	if err != nil {
		return player, err
	}

	player, err = pgx.CollectOneRow(rows, pgx.RowToStructByName[PlayerDataDb])
	if err != pgx.ErrNoRows && err != nil {
		return player, err
	}

	return player, nil
}

func getAllPlayerDataFromDb() ([]PlayerDataDb, error) {
	var players []PlayerDataDb

	rows, err := db.Query(
		context.Background(),
		`select AccountId, TmioData from Player`,
	)
	if err != nil {
		return players, err
	}

	players, err = pgx.CollectRows(rows, pgx.RowToStructByName[PlayerDataDb])
	if err != nil {
		return players, err
	}

	return players, nil
}

func toPlayerData(playerDataDb *PlayerDataDb, playerData *PlayerData) error {
	if playerDataDb.TmioData == "" {
		return errors.New("missing tmioData in db")
	}

	if err := json.Unmarshal([]byte(playerDataDb.TmioData), playerData); err != nil {
		return err
	}
	
	return nil
}

func getPlayerData(accountId string) (PlayerData, error) {
	playerDataDb, err := getPlayerDataFromDb(accountId)
	if err == nil {
		var playerData PlayerData
		err = toPlayerData(&playerDataDb, &playerData)
		if err == nil {
			return playerData, err
		}
	}

	logger.Warn("Missing player data", "accountId", accountId, "err", err)
	return PlayerData{
		AccountId: accountId,
		DisplayName: accountId,
	}, nil
}

func toPlayer(playerData *PlayerData, player *Player) error {
	player.AccountId = playerData.AccountId
	player.Name = playerData.DisplayName

	if player.Image == "" && playerData.Trophies != nil {
		flag := playerData.Trophies.Zone.Flag
		if len(flag) > 3 {
			flag = playerData.Trophies.Zone.Parent.Flag
			if len(flag) > 3 {
				flag = playerData.Trophies.Zone.Parent.Parent.Flag
			}
		}
		
		player.Image = "assets/images/" + flag + ".jpg"
	}

	return nil
}

func getPlayerOverride(accountId string) (Player, error) {
	var player Player

	rows, err := db.Query(
		context.Background(),
		`select AccountId, Name, Image, Twitch, Discord from PlayerOverrides where AccountId=$1`,
		accountId,
	)
	if err != nil {
		return player, err
	}

	player, err = pgx.CollectOneRow(rows, pgx.RowToStructByName[Player])
	if err != pgx.ErrNoRows && err != nil {
		return player, err
	}

	return player, nil
}

func applyPlayerOverrides(player *Player) error {
	playerOverrides, err := getPlayerOverride(player.AccountId);
	if err != nil {
		return err
	}

	if playerOverrides.Name != "" {
		player.Name = playerOverrides.Name
	}
	if playerOverrides.Image != "" {
		player.Image = playerOverrides.Image
	}
	if playerOverrides.Twitch != "" {
		player.Twitch = playerOverrides.Twitch
	}
	if playerOverrides.Discord != "" {
		player.Discord = playerOverrides.Discord
	}

	return nil
}

func PlayerGet(player *Player) error {
	if player.AccountId == "" {
		return errors.New("missing account id, nothing to gets")
	}

	playerData, err := getPlayerData(player.AccountId)
	if err != nil {
		return err
	}

	if err = toPlayer(&playerData, player); err != nil {
		return err
	}

	if err = applyPlayerOverrides(player); err != nil {
		return err
	}

	return nil
}

func PlayerList() ([]*Player, error) {
	var players []*Player
	
	playerDataDb, err := getAllPlayerDataFromDb()
	if err != nil {
		return players, err
	}

	for i := 0; i < len(playerDataDb); i++ {
		var playerData PlayerData
		if err = toPlayerData(&playerDataDb[i], &playerData); err != nil {
			return players, err
		}

		var player Player
		if err = toPlayer(&playerData, &player); err != nil {
			return players, err
		}
	
		if err = applyPlayerOverrides(&player); err != nil {
			return players, err
		}

		players = append(players, &player)
	}

	return players, nil
}

func PlayerAdd(player *Player) error {
	if player.AccountId == "" {
		return errors.New("missing account id, nothing to add")
	}

	url := os.Getenv("TMIO_URL")
	if url == "" {
		return errors.New("missing tmio url, nothing to add")
	}

	req, err := http.NewRequest("GET", url + "/api/player/" + player.AccountId, nil)
	if err != nil {
		return err
	}

	req.Header.Add("User-Agent", "hdweeklyleague.com / hdstmevents@whitacre.dev")
	resp, err := tmio.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	
	tmioRawData, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var playerData PlayerData
	if err := json.Unmarshal(tmioRawData, &playerData); err != nil {
		return err
	}

	if playerData.AccountId == "" {
		return errors.New("missing account id")
	}

	if playerData.DisplayName == "" {
		return errors.New("missing display name")
	}
	
	tmioData := string(tmioRawData[:])
	if tmioData == "" {
		return errors.New("tmiodata shouldnt be an empty string")
	}

	_, err = db.Exec(
		context.Background(),
		`insert into player (AccountId, TmioData) values ($1, $2)`,
		player.AccountId,
		tmioData,
	)
	if err != nil {
		return err
	}

	return nil
}
