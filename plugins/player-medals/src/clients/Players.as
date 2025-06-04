namespace Clients {
    class PlayersClient : Shared::Clients::Client {
        PlayersClient(Domain::ClientOptions@ options) {
            super(options);
        }

        Domain::Player@ FetchPlayer(const string&in accountId) {
            auto response = this.HttpGet("players?accountId=" + accountId);
            if (!response.HasKey("player")) return null;

            return Domain::PlayerFromJson(response["player"]);
        }

        array<Domain::Player@>@ FetchPlayers() {
            auto response = this.HttpGet("players");
            if (!response.HasKey("players")) return {};

            array<Domain::Player@> playersArr = {};
            for (uint i = 0; i < response["players"].Length; i++) {
                auto player = Domain::PlayerFromJson(response["players"][i]);
                playersArr.InsertLast(@player);
            }
            return playersArr;
        }

        void UpsertPlayer(Domain::Player@ player) {
            this.HttpPost("players", player.ToJson());
        }
    }
}
