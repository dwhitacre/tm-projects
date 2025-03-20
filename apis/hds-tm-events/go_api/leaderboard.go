package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	published := r.URL.Query().Get("published")

	var leaderboard domain.Leaderboard
	leaderboard.LeaderboardId = id
	err := domain.LeaderboardGet(&leaderboard, published != "false")
	if err != nil {
		logger.Warn("No leaderboard found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	leaderboard.Players, err = domain.PlayerList()
	if err != nil {
		logger.Warn("Failed to get all players, skipping", "id", id, "err", err)
	}

	logger.Info("Leaderboard found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}

func PatchLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var leaderboard domain.Leaderboard
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&leaderboard); err != nil {
		logger.Warn("Failed to parse leaderboard", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if leaderboard.LeaderboardId == "" {
		logger.Warn("Missing leaderboardId")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if len(leaderboard.Weeklies) < 1 {
		logger.Warn("Nothing to do for leaderboard. No weeklies in request.")
		w.WriteHeader(http.StatusNoContent)
		return
	}

	for i := 0; i < len(leaderboard.Weeklies); i++ {
		if leaderboard.Weeklies[i].Weekly == nil || leaderboard.Weeklies[i].Weekly.WeeklyId == "" {
			logger.Warn("Missing weeklyId in leaderboard.weeklies, skipping", "i", i)
			continue			
		}

		err := domain.LeaderboardWeeklyAdd(leaderboard.LeaderboardId, leaderboard.Weeklies[i].Weekly.WeeklyId)
		if err != nil {
			logger.Warn("Failed to add weeklyId in leaderboard.weeklies, skipping", "i", i, "err", err, "weeklyId", leaderboard.Weeklies[i].Weekly.WeeklyId)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		logger.Info("Adding weekly to leaderboard", "i", i, "leaderboardId", leaderboard.LeaderboardId, "weeklyId", leaderboard.Weeklies[i].Weekly.WeeklyId)
	}
	
	if err := domain.LeaderboardUpdate(leaderboard.LeaderboardId); err != nil {
		logger.Warn("Failed to updated last modified, continuing anyways", "leaderboardId", leaderboard.LeaderboardId, "err", err)
	}

	w.WriteHeader(http.StatusCreated)
}