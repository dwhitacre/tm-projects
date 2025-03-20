[Setting hidden] string S_PlayerAccountId = "c7818ba0-5e85-408e-a852-f658e8b90eec";

namespace Services {
    class CurrentPlayerService : Service {
        Domain::Cache@ medalTimes = Domain::Cache();
        Domain::Campaign@ activeCampaign;
        Domain::Cache@ activeCampaignMedalTimes = Domain::Cache();
        Domain::Cache@ activeCampaignAvailableMedalTimes = Domain::Cache();

        string get_accountId() {
            return S_PlayerAccountId;
        }
        void set_accountId(const string&in accountId) {
            S_PlayerAccountId = accountId;
        }

        Domain::Player@ get_player() {
            return Players.GetPlayer(accountId);
        }

        bool get_exists() {
            return player !is null;
        }
    
        CurrentPlayerService() {
            super();
        }

        bool HasMedalTime(const string&in mapUid) {
            return GetMedalTime(mapUid) !is null;
        }

        Domain::MedalTime@ GetMedalTime(const string&in mapUid) {
            if (!exists) return null;
            return MedalTimes.GetMedalTime(accountId, mapUid);
        }

        array<Domain::Domain@>@ GetMedalTimes() {
            if (!exists) return {};

            auto medalTimes = MedalTimes.GetMedalTimes(accountId);
            if (medalTimes is null) return {};
            return medalTimes;
        }

        void Fetch() {
            Players.FetchPlayer(accountId);
        }

        void FetchMedalTimes() {
            if (!exists) return;
            MedalTimes.FetchMedalTimes(accountId);
        }

        void Reset() {
            this.accountId = "c7818ba0-5e85-408e-a852-f658e8b90eec";
            this.Clear();
        }

        void Clear() {
            @activeCampaign = null;
            activeCampaignAvailableMedalTimes.Clear();
            activeCampaignMedalTimes.Clear();
            medalTimes.Clear();
        }
    }
}

