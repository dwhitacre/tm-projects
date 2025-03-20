namespace Api {
    enum Audience {
        NadeoClubServices,
        NadeoLiveServices,
        NadeoServices
    }

    string getAudienceName(const Audience &in aud) {
        switch (aud) {
            case Audience::NadeoClubServices:
            case Audience::NadeoLiveServices:
                return "NadeoLiveServices";
            case Audience::NadeoServices:
            default:
                return "NadeoServices";
        }
    }

    string getUrl(const Audience &in aud) {
        switch (aud) {
            case Audience::NadeoClubServices:
                return NadeoServices::BaseURLMeet();
            case Audience::NadeoLiveServices:
                return NadeoServices::BaseURLLive();
            case Audience::NadeoServices:
            default:
                return NadeoServices::BaseURLCore();
        }
    }

    void Init() {
        NadeoServices::AddAudience(getAudienceName(Audience::NadeoClubServices));
        NadeoServices::AddAudience(getAudienceName(Audience::NadeoLiveServices));
        NadeoServices::AddAudience(getAudienceName(Audience::NadeoServices));

        while (!NadeoServices::IsAuthenticated(getAudienceName(Audience::NadeoClubServices)) ||
            !NadeoServices::IsAuthenticated(getAudienceName(Audience::NadeoLiveServices)) ||
            !NadeoServices::IsAuthenticated(getAudienceName(Audience::NadeoServices))) 
        {
            yield();
        }
    }

    Json::Value Fetch(const Audience &in aud, const string &in route) {
        auto req = NadeoServices::Get(getAudienceName(aud), getUrl(aud) + "/" + route);
        req.Start();
        while (!req.Finished()) {
            yield();
        }
        return Json::Parse(req.String());
    }

    array<Json::Value> FetchMany(const Audience &in aud, array<string>@ routes) {
        array<Net::HttpRequest@> reqs = {};
        for (uint i = 0; i < routes.Length; i++) {
            auto req = NadeoServices::Get(getAudienceName(aud), getUrl(aud) + "/" + routes[i]);
            req.Start();
            reqs.InsertLast(req);
        }

        array<Json::Value> values = {};
        for (uint i = 0; i < reqs.Length; i++) {
            while (!reqs[i].Finished()) {
                yield();
            }
            values.InsertLast(Json::Parse(reqs[i].String()));
        }

        return values;
    }

    string GetAccountId(const string &in playerName) {
        Json::Value accountInfo = Fetch(Audience::NadeoLiveServices, "api/token/club/" + S_Advanced_ClubId + "/member/" + playerName + "/from-login");
        if (accountInfo.Length <= 1) {
            throw("Failed to get accountId for player: " + playerName);
        }
        return accountInfo["accountId"];
    }

    array<string> GetAccountIds(array<string>@ playerNames) {
        array<string> routes = {};
        for (uint i = 0; i < playerNames.Length; i++) {
            routes.InsertLast("api/token/club/" + S_Advanced_ClubId + "/member/" + playerNames[i] + "/from-login");
        }

        array<Json::Value> accountInfos = FetchMany(Audience::NadeoLiveServices, routes);
        array<string> accountIds = {};
        for (uint i = 0; i < accountInfos.Length; i++) {
            if (accountInfos[i].Length <= 1) {
                throw("Failed to get accountId for player: " + playerNames[i]);
            }

            accountIds.InsertLast(accountInfos[i]["accountId"]);
        }

        return accountIds;
    }

    array<string>@ GetDisplayNames(array<string>@ accountIds) {
        auto displayNamesDict = NadeoServices::GetDisplayNamesAsync(accountIds);
        array<string> displayNames = {};
        displayNames.Reserve(accountIds.Length);

        for (uint i = 0; i < accountIds.Length; i++) {
            if (displayNamesDict.Exists(accountIds[i])) {
                string value = "";
                displayNamesDict.Get(accountIds[i], value);
                displayNames.InsertAt(i, value);
            }
        }

        return displayNames;
    }

    int GetPBTime(const string &in accountId, const string &in mapId) {
        Json::Value pbTimes = Fetch(Audience::NadeoServices, "mapRecords/?accountIdList=" + accountId + "&mapIdList=" + mapId);
        if (pbTimes.Length < 1 || pbTimes[0]["recordScore"] is null) {
            LogWarning("Failed to get pbTime for accountId: " + accountId + "and mapId: " + mapId);
            return -1;
        }
        
        return pbTimes[0]["recordScore"]["time"];
    }

    array<int> GetPBTimes(array<string>@ accountIds, const string &in mapId) {
        Json::Value pbTimes = Fetch(Audience::NadeoServices, "mapRecords/?accountIdList=" + string::Join(accountIds, ",") + "&mapIdList=" + mapId);
        if (pbTimes.Length < 1) {
            LogTrace("Failed to get pbTime for mapId: " + mapId);
        }

        array<int> times = {};
        times.Resize(accountIds.Length);

        for (uint i = 0; i < pbTimes.Length; i++) {
            string accountId = pbTimes[i]["accountId"];
            for (uint j = 0; j < accountIds.Length; j++) {
                if (accountId == accountIds[j]) {
                    int time = -1;
                    if (pbTimes[i]["recordScore"] !is null) time = pbTimes[i]["recordScore"]["time"];
                    times[j] = time;
                }
            }
        }
        
        return times;
    }

    string GetMapId(const string &in mapUid) {
        Json::Value mapInfo = Fetch(Audience::NadeoServices, "maps/?mapUidList=" + mapUid);
        if (mapInfo.Length < 1) {
            throw("Failed to get mapInfo for mapUid: " + mapUid);
        }
        return mapInfo[0]["mapId"];
    }

    string GetMapName(const string &in mapUid) {
        Json::Value mapInfo = Fetch(Audience::NadeoServices, "maps/?mapUidList=" + mapUid);
        if (mapInfo.Length < 1) {
            throw("Failed to get mapInfo for mapUid: " + mapUid);
        }
        string name = mapInfo[0]["name"];
        return Regex::Replace(name, "\\$[A-z0-9]{0,3}", "");
    }

    Campaign@ GetClubCampaign(int campaignId) {
        string campaignIdStr = Text::Format("%d", campaignId);
        Json::Value json = Fetch(Audience::NadeoLiveServices, "api/token/club/" + S_Advanced_ClubId + "/campaign/" + campaignIdStr);
        if (json is null || json["campaignId"] != campaignId || json["campaign"] is null) {
            LogError("Failed to get campaign: " + campaignIdStr);
            return Campaign();
        }
        
        Campaign campaign = Campaign(json["campaign"]["name"], json["campaign"]["leaderboardGroupUid"], json["campaignId"]);
        for (uint i = 0; i < json["campaign"]["playlist"].Length; i++) {
            campaign.playlist.InsertLast(CampaignMap(
                json["campaign"]["playlist"][i]["id"],
                json["campaign"]["playlist"][i]["position"],
                json["campaign"]["playlist"][i]["mapUid"]
            ));
        }

        LogTrace(campaign.ToString());
        return campaign;
    }

    GroupLeaderboard@ GetGroupLeaderboard(string campaignUid) {
        Json::Value json = Fetch(Audience::NadeoLiveServices, "api/token/leaderboard/group/" + campaignUid + "/top");
        if (json is null || json["groupUid"] != campaignUid || json["tops"] is null) {
            LogError("Failed to get group leaderboard: " + campaignUid);
            return GroupLeaderboard();
        }

        GroupLeaderboard glb = GroupLeaderboard(json["groupUid"]);
        for (uint i = 0; i < json["tops"].Length; i++) {
            glb.tops.InsertLast(LeaderboardZone(
                json["tops"][i]["zoneId"],
                json["tops"][i]["zoneName"]
            ));

            for (uint j = 0; j < json["tops"][i]["top"].Length; j++) {
                glb.tops[glb.tops.Length - 1].rankings.InsertLast(LeaderboardRanking(
                    json["tops"][i]["top"][j]["accountId"],
                    json["tops"][i]["top"][j]["zoneId"],
                    json["tops"][i]["top"][j]["zoneName"],
                    json["tops"][i]["top"][j]["position"],
                    json["tops"][i]["top"][j]["sp"]
                ));
            }
        }

        LogTrace(glb.ToString());
        return glb;
    }

    GroupLeaderboard@ GetMapLeaderboard(string campaignUid, string mapUid) {
        Json::Value json = Fetch(Audience::NadeoLiveServices, "api/token/leaderboard/group/" + campaignUid + "/map/" + mapUid + "/top");
        if (json is null || json["groupUid"] != campaignUid || json["tops"] is null) {
            LogError("Failed to get map leaderboard: " + mapUid + ", for group: " + campaignUid);
            return GroupLeaderboard();
        }

        GroupLeaderboard glb = GroupLeaderboard(json["groupUid"], json["mapUid"]);
        for (uint i = 0; i < json["tops"].Length; i++) {
            glb.tops.InsertLast(LeaderboardZone(
                json["tops"][i]["zoneId"],
                json["tops"][i]["zoneName"]
            ));

            for (uint j = 0; j < json["tops"][i]["top"].Length; j++) {
                int score = json["tops"][i]["top"][j]["score"];
                glb.tops[glb.tops.Length - 1].rankings.InsertLast(LeaderboardRanking(
                    json["tops"][i]["top"][j]["accountId"],
                    json["tops"][i]["top"][j]["zoneId"],
                    json["tops"][i]["top"][j]["zoneName"],
                    json["tops"][i]["top"][j]["position"],
                    Text::Format("%d", score)
                ));
            }
        }

        LogTrace(glb.ToString());
        return glb;
    }

    GroupLeaderboard@ GetYourLeaderboard(string campaignUid, string accountId) {
        Json::Value json = Fetch(Audience::NadeoLiveServices, "api/token/leaderboard/group/" + campaignUid);
        if (json is null || json["groupUid"] != campaignUid || json["zones"] is null) {
            LogError("Failed to get your group leaderboard: " + campaignUid);
            return GroupLeaderboard();
        }

        GroupLeaderboard glb = GroupLeaderboard(json["groupUid"]);
        string yourZoneId = json["zones"][json["zones"].Length - 1]["zoneId"];
        string yourZoneName = json["zones"][json["zones"].Length - 1]["zoneName"];
        for (uint i = 0; i < json["zones"].Length; i++) {
            glb.tops.InsertLast(LeaderboardZone(
                json["zones"][i]["zoneId"],
                json["zones"][i]["zoneName"]
            ));

            glb.tops[glb.tops.Length - 1].rankings.InsertLast(LeaderboardRanking(
                accountId,
                yourZoneId,
                yourZoneName,
                json["zones"][i]["ranking"]["position"],
                json["sp"] is null ? "0" : json["sp"]
            ));
        }

        LogTrace(glb.ToString());
        return glb;
    }

    Json::Value FetchSettings(const string &in route) {
        auto req = Net::HttpGet(S_Advanced_OpenplanetConfigUrl + "/" + route);
        req.Start();
        while (!req.Finished()) {
            yield();
        }
        return Json::Parse(req.String());
    }
}
