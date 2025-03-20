class Campaign {
    string name = "";
    string leaderboardGroupUid = "";
    int campaignId = 0;
    array<CampaignMap@>@ playlist = {};

    Campaign() {}
    Campaign(const string &in name, const string &in leaderboardGroupUid, int campaignId) {
        this.name = name;
        this.leaderboardGroupUid = leaderboardGroupUid;
        this.campaignId = campaignId;
    }

    int opCmp(Campaign@ other) {
        return this.campaignId - other.campaignId;
    }

    string ToString() {
        array<string> playlist = {};
        for (uint i = 0; i < this.playlist.Length; i++) {
            playlist.InsertLast(this.playlist[i].ToString());
        }

        return KeyValuesToString({
            {"name", this.name},
            {"leaderboardGroupUid", this.leaderboardGroupUid},
            {"campaignId", Text::Format("%d", this.campaignId)},
            {"playlist", ArrayToString(playlist)}
        });
    }
}
