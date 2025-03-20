class CampaignMap {
    int id = -1;
    int position = -1;
    string uid = "";
    string name = "";

    CampaignMap() {}
    CampaignMap(int id, int position, const string &in uid) {
        this.id = id;
        this.position = position;
        this.uid = uid;
        if (this.uid != "") this.name = MapMgr::GetMapName(this.uid);
    }

    int opCmp(CampaignMap@ other) {
        return this.position - other.position;
    }

    string ToString() {
        return KeyValuesToString({
            {"id", Text::Format("%d", this.id)},
            {"position", Text::Format("%d", this.position)},
            {"uid", this.uid},
            {"name", this.name}
        });
    }
}
