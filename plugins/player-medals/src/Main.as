void Main() {
    startnew(Services::StartReadyHealthCheck);
    startnew(Services::LoadServices);
    startnew(Services::StartPBLoop);
    // TODO: active map loop?
}

bool HasCurrentPlayerMedalTime(const string &in mapUid) {
    if (mapUid.Length == 0) return false;
    return Services::CurrentPlayer.HasMedalTime(mapUid);
}

int64 GetCurrentPlayerMedalTime(const string &in mapUid) {
    if (mapUid.Length == 0) return -1;
    if (!Services::CurrentPlayer.HasMedalTime(mapUid)) return -1;

    auto medalTime = Services::CurrentPlayer.GetMedalTime(mapUid);
    if (medalTime is null) return -1;
    return medalTime.time;
}

string GetMapMedalTimesJson(const string &in mapUid) {
    Json::Value result = Json::Array();
    if (mapUid.Length == 0) return Json::Write(result);
    if (!Services::CurrentPlayer.HasMedalTime(mapUid)) return Json::Write(result);

    auto medalTime = Services::CurrentPlayer.GetMedalTime(mapUid);
    if (medalTime is null) return Json::Write(result);
    auto player = Services::CurrentPlayer.player;
    if (player is null) @player = medalTime.player;

    string playerName = medalTime.accountId;
    string playerColor = "3f3";
    if (player !is null) {
        if (player.viewName.Length > 0) playerName = player.viewName;
        if (player.color.Length > 0) playerColor = player.color;
    }

    Json::Value item = Json::Object();
    item["mapUid"] = medalTime.mapUid;
    item["accountId"] = medalTime.accountId;
    item["medalTime"] = medalTime.medalTime;
    item["customMedalTime"] = medalTime.customMedalTime;
    item["time"] = medalTime.time;
    item["reason"] = medalTime.reason;
    item["playerName"] = playerName;
    item["playerColor"] = playerColor;
    result.Add(item);
    return Json::Write(result);
}

void Render() {
    View::Main.Render();
    View::Medal.Render();
}

void RenderEarly() {
    View::RenderUIMedals();
}

void RenderMenu() {
    View::Menu.Render();
}
