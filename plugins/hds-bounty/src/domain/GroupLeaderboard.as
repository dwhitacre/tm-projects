class GroupLeaderboard {
    string groupUid = "";
    string mapUid = "";
    string mapName = "";
    array<LeaderboardZone@>@ tops = {};

    GroupLeaderboard() {}
    GroupLeaderboard(const string &in groupUid, const string &in mapUid = "") {
        this.groupUid = groupUid;
        this.mapUid = mapUid;
        if (this.mapUid != "") this.mapName = MapMgr::GetMapName(this.mapUid);
    }

    string ToString() {
        array<string> tops = {};
        for (uint i = 0; i < this.tops.Length; i++) {
            tops.InsertLast(this.tops[i].ToString());
        }

        return KeyValuesToString({
            {"groupUid", this.groupUid},
            {"mapUid", this.mapUid},
            {"mapName", this.mapName},
            {"tops", ArrayToString(tops)}
        });
    }
}
