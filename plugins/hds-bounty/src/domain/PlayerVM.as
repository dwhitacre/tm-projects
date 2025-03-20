class PlayerVM {
    string accountId = "";
    string name = "Unknown Player";
    int teamId = 0;
    int time = -1;

    PlayerVM() {}
    PlayerVM(const string &in name, int teamId) {
        this.accountId = AccountMgr::GetAccountId(name);
        this.name = name;
        this.teamId = teamId;
    }
    PlayerVM(const string &in accountId) {
        this.name = AccountMgr::GetDisplayName(accountId);
        this.accountId = accountId;
    }

    int opCmp(PlayerVM@ other) {
        return TimeMgr::CompareTimes(this.time, other.time);
    }

    string ToString() {
        return KeyValuesToString({
            {"accountId", this.accountId},
            {"name", this.name},
            {"teamId", Text::Format("%d", this.teamId)},
            {"time", Text::Format("%d", this.time)}
        });
    }
}
