namespace Domain {
    class MedalTime : Domain {
        string mapUid;
        int64 medalTime;
        string accountId;
        int64 customMedalTime = -1;
        string reason = "";
        string dateModified = "";

        Player@ player = Player("", "", "");
        Map@ map = Map("", -1, "");

        int64 get_time() {
            return customMedalTime >= 0 ? customMedalTime : medalTime;
        }

        MedalTime(const string&in mapUid, int64 medalTime, const string&in accountId) {
            super();
            this.mapUid = mapUid;
            this.medalTime = medalTime;
            this.accountId = accountId;
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["mapUid"] = this.mapUid;
            json["medalTime"] = this.medalTime;
            json["accountId"] = this.accountId;
            json["customMedalTime"] = this.customMedalTime;
            json["reason"] = this.reason;
            json["dateModified"] = this.dateModified;
            json["player"] = this.player.ToJson();
            json["map"] = this.map.ToJson();
            return json;
        }

        array<string>@ Columns() override {
            return {
                "mapUid",
                "medalTime",
                "accountId",
                "customMedalTime",
                "reason",
                "dateModified"
            };
        }

        int CompareTo(Domain@ other) override {
            auto otherMedalTime = cast<MedalTime@>(other);
            if (otherMedalTime is null) return 0;

            if (this.time < otherMedalTime.time) return -1;
            if (this.time > otherMedalTime.time) return 1;

            return 0;
        }

        Domain@ Copy() override {
            auto medalTime = MedalTime(this.mapUid, this.medalTime, this.accountId);
            medalTime.customMedalTime = this.customMedalTime;
            medalTime.reason = this.reason;
            medalTime.dateModified = this.dateModified;
            medalTime.player = cast<Domain::Player@>(this.player.Copy());
            medalTime.map = cast<Domain::Map@>(this.map.Copy());
            return medalTime;
        }
    }

    MedalTime@ MedalTimeFromJson(Json::Value@ json) {
        if (!json.HasKey("mapUid")) throw("Failed to parse medalTime: no mapUid");
        if (!json.HasKey("medalTime")) throw("Failed to parse medalTime: no medalTime");
        if (!json.HasKey("accountId")) throw("Failed to parse medalTime: no accountId");

        auto medalTime = MedalTime(string(json["mapUid"]), int64(json["medalTime"]), string(json["accountId"]));
        if (json.HasKey("customMedalTime")) medalTime.customMedalTime = int64(json["customMedalTime"]);
        if (json.HasKey("reason")) medalTime.reason = string(json["reason"]);
        if (json.HasKey("dateModified")) medalTime.dateModified = string(json["dateModified"]);

        if (json.HasKey("player")) medalTime.player = PlayerFromJson(json["player"]);
        if (json.HasKey("map")) medalTime.map = MapFromJson(json["map"]);

        return medalTime;
    }
}