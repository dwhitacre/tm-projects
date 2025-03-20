namespace Domain {
    class Map : Domain {
        string mapUid;
        int64 authorTime;
        string name;
        string campaign = "";
        int64 campaignIndex = -1;
        string totdDate = "";
        string dateModified = "";
        bool nadeo = false;
        
        uint8 get_index() const {
            if (totdDate.Length > 0) return uint8(Text::ParseUInt(totdDate.SubStr(totdDate.Length - 2)) - 1);
            return uint8(Text::ParseUInt(name.SubStr(name.Length - 2)) - 1);
        }

        Map(const string&in mapUid, int64 authorTime, const string&in name) {
            super();
            this.mapUid = mapUid;
            this.authorTime = authorTime;
            this.name = name;
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["mapUid"] = this.mapUid;
            json["authorTime"] = this.authorTime;
            json["name"] = this.name;
            json["campaign"] = this.campaign;
            json["campaignIndex"] = this.campaignIndex;
            json["totdDate"] = this.totdDate;
            json["dateModified"] = this.dateModified;
            json["nadeo"] = this.nadeo;
            json["index"] = this.index;
            return json;
        }

        array<string>@ Columns() override {
            return {
                "mapUid",
                "authorTime",
                "name",
                "campaign",
                "campaignIndex",
                "totdDate",
                "nadeo",
                "index",
                "dateModified"
            };
        }

        int CompareTo(Domain@ other) override {
            auto otherMap = cast<Map@>(other);
            if (otherMap is null) return 0;

            if (this.index < otherMap.index) return 1;
            if (this.index > otherMap.index) return -1;

            return 0;
        }

        Domain@ Copy() override {
            auto map = Map(this.mapUid, this.authorTime, this.name);
            map.campaign = this.campaign;
            map.campaignIndex = this.campaignIndex;
            map.totdDate = this.totdDate;
            map.dateModified = this.dateModified;
            map.nadeo = this.nadeo;
            return map;
        }
    }

    Map@ MapFromJson(Json::Value@ json) {
        if (!json.HasKey("mapUid")) throw("Failed to parse map: no mapUid");
        if (!json.HasKey("authorTime")) throw("Failed to parse map: no authorTime");
        if (!json.HasKey("name")) throw("Failed to parse map: no name");

        auto map = Map(string(json["mapUid"]), int64(json["authorTime"]), string(json["name"]));
        if (json.HasKey("campaign")) map.campaign = string(json["campaign"]);
        if (json.HasKey("campaignIndex")) map.campaignIndex = int64(json["campaignIndex"]);
        if (json.HasKey("totdDate")) map.totdDate = string(json["totdDate"]);
        if (json.HasKey("dateModified")) map.dateModified = string(json["dateModified"]);
        if (json.HasKey("nadeo")) map.nadeo = bool(json["nadeo"]);

        return map;
    }
}