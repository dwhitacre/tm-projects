package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func PlayerHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var player domain.Player
	player.AccountId = id
	err := domain.PlayerGet(&player)

	if err != nil {
		logger.Warn("No player found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Player found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(player)
}

func CreatePlayerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var player domain.Player
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&player); err != nil {
		logger.Warn("Failed to parse player", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := domain.PlayerAdd(&player)
	if err != nil {
		logger.Warn("Failed to add player", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	logger.Info("Added player", "accountId", player.AccountId)
	w.WriteHeader(http.StatusCreated)
}