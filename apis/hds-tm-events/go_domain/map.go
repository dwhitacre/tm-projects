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

type MapData struct {
	MapUid string `json:"mapUid"`
	Name string `json:"name"`
	ThumbnailUrl string `json:"thumbnailUrl"`
}

type MapDataDb struct {
	MapUid string `json:"mapUid"`
	TmioData string `json:"tmioData"`
}

type Map = MapData

func getMapDataFromDb(mapUid string) (MapDataDb, error) {
	var mapData MapDataDb

	rows, err := db.Query(
		context.Background(),
		`select MapUid, TmioData from Map where MapUid=$1`,
		mapUid,
	)
	if err != nil {
		return mapData, err
	}

	mapData, err = pgx.CollectOneRow(rows, pgx.RowToStructByName[MapDataDb])
	if err != pgx.ErrNoRows && err != nil {
		return mapData, err
	}

	return mapData, nil
}

func getAllMapDataFromDb() ([]MapDataDb, error) {
	var maps []MapDataDb

	rows, err := db.Query(
		context.Background(),
		`select MapUid, TmioData from Map`,
	)
	if err != nil {
		return maps, err
	}

	maps, err = pgx.CollectRows(rows, pgx.RowToStructByName[MapDataDb])
	if err != nil {
		return maps, err
	}

	return maps, nil
}

func toMapData(mapDataDb *MapDataDb, mapData *MapData) error {
	if mapDataDb.TmioData == "" {
		return errors.New("missing tmioData in db")
	}

	if err := json.Unmarshal([]byte(mapDataDb.TmioData), mapData); err != nil {
		return err
	}
	
	return nil
}

func toMap(mapData *MapData, m *Map) error {
	m.MapUid = mapData.MapUid
	m.Name = mapData.Name
	m.ThumbnailUrl = mapData.ThumbnailUrl
	return nil
}

func MapGet(m *Map) error {
	if m.MapUid == "" {
		return errors.New("missing map uid, nothing to gets")
	}

	mapDataDb, err := getMapDataFromDb(m.MapUid)
	if err != nil {
		return err
	}

	var mapData MapData
	if err = toMapData(&mapDataDb, &mapData); err != nil {
		return err
	}

	if err = toMap(&mapData, m); err != nil {
		return err
	}

	return nil
}

func MapList() ([]*Map, error) {
	var maps []*Map
	
	mapDataDb, err := getAllMapDataFromDb()
	if err != nil {
		return maps, err
	}

	for i := 0; i < len(mapDataDb); i++ {
		var mapData MapData
		if err = toMapData(&mapDataDb[i], &mapData); err != nil {
			return maps, err
		}

		var m Map
		if err = toMap(&mapData, &m); err != nil {
			return maps, err
		}

		maps = append(maps, &m)
	}

	return maps, nil
}


func MapAdd(m *Map) error {
	if m.MapUid == "" {
		return errors.New("missing map uid, nothing to add")
	}

	url := os.Getenv("TMIO_URL")
	if url == "" {
		return errors.New("missing tmio url, nothing to add")
	}

	req, err := http.NewRequest("GET", url + "/api/map/" + m.MapUid, nil)
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

	var mapData MapData
	if err := json.Unmarshal(tmioRawData, &mapData); err != nil {
		return err
	}

	if mapData.MapUid == "" {
		return errors.New("missing map uid")
	}

	if mapData.Name == "" {
		return errors.New("missing name")
	}
	
	tmioData := string(tmioRawData[:])
	if tmioData == "" {
		return errors.New("tmiodata shouldnt be an empty string")
	}

	_, err = db.Exec(
		context.Background(),
		`insert into map (MapUid, TmioData) values ($1, $2)`,
		m.MapUid,
		tmioData,
	)
	if err != nil {
		return err
	}

	return nil
}
