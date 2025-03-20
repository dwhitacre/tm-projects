package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func CreateWeeklyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var weekly domain.Weekly
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&weekly); err != nil {
		logger.Warn("Failed to parse weekly", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := domain.WeeklyAdd(&weekly)
	if err != nil {
		logger.Warn("Failed to create weekly", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	logger.Info("Created weekly", "id", weekly.WeeklyId)
	w.WriteHeader(http.StatusCreated)
}

func WeeklyMapListHandler(w http.ResponseWriter, r *http.Request) {
	weeklyId := r.PathValue("id")
	maps, err := domain.WeeklyMapList(weeklyId)
	if err != nil {
		logger.Warn("Failed to get all weekly maps", "weeklyId", weeklyId, "err", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	logger.Info("Weekly map list found")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(maps)
}

func WeeklyMapHandler(w http.ResponseWriter, r *http.Request) {
	weeklyId := r.PathValue("id")
	
	var weekly domain.Weekly
	weekly.WeeklyId = weeklyId
	err := domain.WeeklyGet(&weekly)
	
	if err != nil {
		logger.Warn("No weekly found with weeklyId", "weeklyId", weeklyId, "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if (r.Method == http.MethodGet) {
		WeeklyMapListHandler(w, r)
		return
	}

	var weeklyMap domain.WeeklyMapData
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&weeklyMap); err != nil {
		logger.Warn("Failed to parse weeklyMap", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if weeklyMap.MapUid == "" {
		logger.Warn("Missing mapUid")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodPut {
		err := domain.WeeklyMapAdd(weeklyId, weeklyMap.MapUid)
		if err != nil {
			logger.Error("Failed to add weeklyMap", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		logger.Info("Added weekly map", "weeklyId", weeklyId, "mapUid", weeklyMap.MapUid)
	} else if r.Method == http.MethodDelete {
		err := domain.WeeklyMapDelete(weeklyId, weeklyMap.MapUid)
		if err != nil {
			logger.Error("Failed to delete weeklyMap", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		logger.Info("Deleted weekly map", "weeklyId", weeklyId, "mapUid", weeklyMap.MapUid)
	}

	w.WriteHeader(http.StatusOK)
}
