namespace Clients {
    class MapsClient : Shared::Clients::Client {
        MapsClient(Domain::ClientOptions@ options) {
            super(options);
        }

        Domain::Map@ FetchMap(const string&in mapUid) {
            auto response = this.HttpGet("maps?mapUid=" + mapUid);
            if (!response.HasKey("map")) return null;

            return Domain::MapFromJson(response["map"]);
        }

        array<Domain::Map@>@ FetchCampaign(const string&in campaign) {
            auto response = this.HttpGet("maps?campaign=" + campaign);
            if (!response.HasKey("maps")) return {};

            array<Domain::Map@> mapsArr = {};
            for (uint i = 0; i < response["maps"].Length; i++) {
                auto map = Domain::MapFromJson(response["maps"][i]);
                mapsArr.InsertLast(@map);
            }
            return mapsArr;
        }

        array<Domain::Map@>@ FetchMaps() {
            auto response = this.HttpGet("maps");
            if (!response.HasKey("maps")) return {};

            array<Domain::Map@> mapsArr = {};
            for (uint i = 0; i < response["maps"].Length; i++) {
                auto map = Domain::MapFromJson(response["maps"][i]);
                mapsArr.InsertLast(@map);
            }
            return mapsArr;
        }

        void UpsertMap(Domain::Map@ map) {
            this.HttpPost("maps", map.ToJson());
        }
    }
}
