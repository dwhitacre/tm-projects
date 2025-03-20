namespace Services {
    bool PlayerSubmitting = false;

    class PlayersService : Service {
        Domain::Cache@ playersCache = Domain::Cache();
        Clients::PlayersClient@ client;

        PlayersService() {
            super();
            @client = Clients::PlayersClient(Settings.options);
        }

        Domain::Player@ GetPlayer(const string&in accountId) {
            if (!playersCache.Exists(accountId)) return null;
            return cast<Domain::Player@>(playersCache.Get(accountId));
        }

        array<Domain::Domain@>@ GetPlayers() {
            return playersCache.GetAll();
        }

        void FetchPlayer(const string&in accountId) {
            auto player = client.FetchPlayer(accountId);
            if (player is null) return;

            playersCache.Set(player.accountId, @player);
        }

        void FetchPlayers() {
            auto players = client.FetchPlayers();
            if (players is null) return;

            for (uint i = 0; i < players.Length; i++) {
                playersCache.Set(players[i].accountId, @players[i]);
            }
        }

        void UpsertPlayer(Domain::Player@ player) {
            if (!Me.HasPermission(Domain::Permission::PlayerManage)) {
                warn("You dont have permission to UpsertPlayer.");
                return;
            }

            client.UpsertPlayer(player);
            FetchPlayer(player.accountId);
        }

        void Clear() {
            playersCache.Clear();
        }
    }

    void SubmitPlayer(ref@ playerRef) {
        if (playerRef is null) {
            warn("Player is null.");
            return;
        }

        auto player = cast<Domain::Player@>(playerRef);
        PlayerSubmitting = true;
        Players.UpsertPlayer(player);

        // TODO: clearing the copy service caches shouldnt really be done
        // from here as the keys are tracked in view. but since its a coroutine
        // we cant clear it properly from the view atm.
        Services::Copy.Remove("playerManage_existingPlayer");
        Services::Copy.Remove("playerManage_currentPlayer");

        PlayerSubmitting = false;
        trace("Player submitted.");
    }
}
