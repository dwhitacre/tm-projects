namespace TimeMgr {
    int GetPBTime(const string &in accountId, const string &in mapUid) {
        string mapId = MapMgr::GetMapId(mapUid);
        LogTrace("Getting pb time:\naccountId: " + accountId + "\nmapId: " + mapId);
        return Api::GetPBTime(accountId, mapId);
    }

    array<int> GetPBTimes(array<string>@ accountIds, const string &in mapUid) {
        string mapId = MapMgr::GetMapId(mapUid);
        LogTrace("Getting pb times:\nmapId: " + mapId + "\naccountIds:\n" + ArrayToString(accountIds));
        return Api::GetPBTimes(accountIds, mapId);
    }

    int CompareTimes(int timeA, int timeB) {
        if ((timeA >= 0) == (timeB >= 0)) {
            int64 diff = int64(timeA) - int64(timeB);
            return diff == 0 ? 0 : diff > 0 ? 1 : -1;
        } else {
            int64 diff = int64(timeB) - int64(timeA);
            return diff == 0 ? 0 : diff > 0 ? 1 : -1;
        }
    }

    void UpdateTimes(array<PlayerVM@>@ players, const string &in mapUid) {
        array<string> accountIds = {};
        for (uint i = 0; i < players.Length; i++) {
            accountIds.InsertLast(players[i].accountId);
        }

        array<int> times = GetPBTimes(accountIds, mapUid);
        for (uint i = 0; i < players.Length; i++) {
            players[i].time = times[i];
        }
    }
}