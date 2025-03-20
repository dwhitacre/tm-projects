namespace Domain {
    class PB : Domain {
        string mapUid;
        string groupUid = "Personal_Best";
        int64 score = -1;

        PB(const string&in mapUid) {
            super();
            this.mapUid = mapUid;
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["mapUid"] = this.mapUid;
            json["groupUid"] = this.groupUid;
            if (score > -1) json["score"] = this.score;
            return json;
        }

        array<string>@ Columns() override {
            array<string>@ cols = {
                "mapUid",
                "groupUid"
            };
            if (score > -1) cols.InsertLast("score");
            return cols;
        }

        int CompareTo(Domain@ other) override {
            auto otherPB = cast<PB@>(other);
            if (otherPB is null) return 0;

            if (this.score < otherPB.score) return -1;
            if (this.score > otherPB.score) return 1;

            return 0;
        }

        Domain@ Copy() override {
            auto pb = PB(this.mapUid);
            pb.groupUid = this.groupUid;
            pb.score = this.score;
            return pb;
        }

        bool HasMedalTime(Domain::MedalTime@ medalTime) {
            if (medalTime is null) return false;
            return this.score <= medalTime.time;
        }
    }

    PB@ PBFromJson(Json::Value@ json) {
        if (!json.HasKey("mapUid")) throw("Failed to parse map: no mapUid");

        auto pb = PB(string(json["mapUid"]));
        if (json.HasKey("groupUid")) pb.groupUid = string(json["groupUid"]);
        if (json.HasKey("score")) pb.score = int64(json["score"]);

        return pb;
    }
}