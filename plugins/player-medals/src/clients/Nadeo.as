namespace Clients {
    class NadeoClient : Client {
        NadeoClient(Domain::ClientOptions@ options) {
            super(options);
        }

        array<Domain::PB@>@ FetchPBs(array<string>@ mapUids = {}) {
            if (mapUids.Length < 1) return {};

            Json::Value@ body = Json::Object();
            body["maps"] = Json::Array();

            for (uint i = 0; i < mapUids.Length; ++i) { 
                body["maps"].Add(Domain::PB(mapUids[i]).ToJson());
            }

            auto response = this.NadeoLivePost("api/token/leaderboard/group/map", body);
            array<Domain::PB@> pbsArr = {};
            for (uint i = 0; i < response.Length; i++) {
                auto pb = Domain::PBFromJson(response[i]);
                pbsArr.InsertLast(@pb);
            }
            return pbsArr;
        }
    }
}
