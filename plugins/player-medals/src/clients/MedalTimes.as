namespace Clients {
    class MedalTimesClient : Client {
        MedalTimesClient(Domain::ClientOptions@ options) {
            super(options);
        }

        Domain::MedalTime@ FetchMedalTime(const string&in accountId, const string&in mapUid) {
            auto response = this.HttpGet("medaltimes?accountId=" + accountId + "&mapUid=" + mapUid);
            if (!response.HasKey("medalTimes")) return null;
            if (response["medalTimes"].Length < 1) return null;

            return Domain::MedalTimeFromJson(response["medalTimes"][0]);
        }

        array<Domain::MedalTime@>@ FetchMedalTimes(const string&in accountId) {
            auto response = this.HttpGet("medaltimes?accountId=" + accountId);
            if (!response.HasKey("medalTimes")) return {};

            array<Domain::MedalTime@> medalTimesArr = {};
            for (uint i = 0; i < response["medalTimes"].Length; i++) {
                auto medalTime = Domain::MedalTimeFromJson(response["medalTimes"][i]);
                medalTimesArr.InsertLast(@medalTime);
            }
            return medalTimesArr;
        }

        void UpsertMedalTime(Domain::MedalTime@ medalTime) {
            this.HttpPost("medaltimes", medalTime.ToJson());
        }
    }
}
