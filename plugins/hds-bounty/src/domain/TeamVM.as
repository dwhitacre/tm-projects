class TeamVM {
    string name = "Unknown Team";
    int id = 0;
    array<PlayerVM@>@ players = {};

    int totalTime 
    { 
        get
        {
            if (this.players.Length < 1) return -1;
            int time = 0;
            for (uint i = 0; i < this.players.Length; i++) {
                time += this.players[i].time;
            }
            return time;
        }
    }

    int avgTime 
    { 
        get
        {
            if (this.players.Length < 1) return -1;
            return this.totalTime / this.players.Length;
        }
    }

    TeamVM() {}
    TeamVM(const string &in name, const int &in id) {
        this.name = name;
        this.id = id;
    }

    int opCmp(TeamVM@ other) {
        return TimeMgr::CompareTimes(this.totalTime, other.totalTime);
    }

    string ToString() {
        return KeyValuesToString({
            {"name", this.name},
            {"id", Text::Format("%d", this.id)},
            {"playersLength", Text::Format("%d", this.players.Length)}
        });
    }
}
