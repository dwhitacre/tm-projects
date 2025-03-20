class LeaderboardZone {
    string zoneId = "";
    string zoneName = "";
    array<LeaderboardRanking@>@ rankings = {};

    LeaderboardZone() {}
    LeaderboardZone(const string &in zoneId, const string &in zoneName) {
        this.zoneId = zoneId;
        this.zoneName = zoneName;
    }

    string ToString() {
        array<string> rankings = {};
        for (uint i = 0; i < this.rankings.Length; i++) {
            rankings.InsertLast(this.rankings[i].ToString());
        }

        return KeyValuesToString({
            {"zoneId", this.zoneId},
            {"zoneName", this.zoneName},
            {"rankings", ArrayToString(rankings)}
        });
    }
}
