package main

import (
	"context"
	"hdstmevents-api/api"
	"hdstmevents-api/domain"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_CONNSTR"))
	if err != nil {
		logger.Error("Unable to connect to database", err)
		os.Exit(1)
	}
	defer pool.Close()

	tmio := &http.Client{
		Timeout: time.Second * 20,
	}

	domain.Setup(logger, pool, tmio)
	api.Setup(logger, pool)
	http.HandleFunc("/ready", api.ReadyHandler)
	http.HandleFunc("/api/ready", api.ReadyHandler)
	http.HandleFunc("/api/leaderboard/{id}", api.LeaderboardHandler)
	http.HandleFunc("/api/leaderboard", api.AdminMiddleware(api.PatchLeaderboardHandler))
	http.HandleFunc("/api/player/{id}", api.PlayerHandler)
	http.HandleFunc("/api/player", api.AdminMiddleware(api.CreatePlayerHandler))
	http.HandleFunc("/api/match/{matchId}/matchresult", api.AdminMiddleware(api.MatchResultHandler))
	http.HandleFunc("/api/weekly", api.AdminMiddleware(api.CreateWeeklyHandler))
	http.HandleFunc("/api/weekly/{id}/map", api.AdminExceptionMiddleware(api.WeeklyMapHandler, []string{ http.MethodGet }))
	http.HandleFunc("/api/admin", api.AdminMiddleware(api.AdminHandler))
	http.HandleFunc("/api/map/{id}", api.GetMapHandler)
	http.HandleFunc("/api/map", api.AdminExceptionMiddleware(api.MapHandler, []string{ http.MethodGet }))
	http.HandleFunc("/", api.DirectHandler)

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(os.Getenv("HOST") + ":8081", nil))
}