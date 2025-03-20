
namespace Domain {
    namespace Permission {
        const string View = "view";
        const string PlayerManage = "player:manage";
        const string GameModeManage = "gamemode:manage";
        const string LeaderboardManage = "leaderboard:manage";
        const string ApiKeyManage = "apikey:manage";
        const string Admin = "admin";
    }
    
    class Player : Domain {
        string accountId;
        string name;
        string color;
        string dateModified = "";
        string displayName = "";
        array<string> permissions = {};

        string get_colorStr() {
            return "\\$" + this.color;
        }

        string get_viewName() {
            if (displayName != "") return displayName;
            return name;
        }

        Player(const string&in accountId, const string&in name, const string&in color) {
            super();
            this.accountId = accountId;
            this.name = name;
            this.color = color;
        }

        bool HasPermission(const string&in permission) {
            return this.permissions.Find(permission) >= 0;
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["accountId"] = this.accountId;
            json["name"] = this.name;
            json["color"] = this.color;
            json["dateModified"] = this.dateModified;
            json["displayName"] = this.displayName;
            json["permissions"] = this.permissions.ToJson();
            return json;
        }

        array<string>@ Columns() override {
            return {
                "accountId",
                "name",
                "color",
                "displayName",
                "dateModified",
                "permissions"
            };
        }

        int CompareTo(Domain@ other) override {
            auto otherPlayer = cast<Player@>(other);
            if (otherPlayer is null) return 0;

            if (this.viewName.ToLower() < otherPlayer.viewName.ToLower()) return 1;
            if (this.viewName.ToLower() > otherPlayer.viewName.ToLower()) return -1;
            return 0;
        }

        Domain@ Copy() override {
            auto player = Player(this.accountId, this.name, this.color);
            player.dateModified = this.dateModified;
            player.displayName = this.displayName;
            player.permissions = this.permissions;
            return player;
        }
    }

    Player@ PlayerFromJson(Json::Value@ json) {
        if (!json.HasKey("accountId")) throw("Failed to parse player: no accountId");
        if (!json.HasKey("name")) throw("Failed to parse player: no name");
        if (!json.HasKey("color")) throw("Failed to parse player: no color");

        auto player = Player(string(json["accountId"]), string(json["name"]), string(json["color"]));
        if (json.HasKey("dateModified")) player.dateModified = string(json["dateModified"]);
        if (json.HasKey("displayName")) player.displayName = string(json["displayName"]);
        if (json.HasKey("permissions")) {
            for (uint i = 0; i < json["permissions"].Length; i++) {
                player.permissions.InsertLast(json["permissions"][i]);
            }
        }

        return player;
    }
}