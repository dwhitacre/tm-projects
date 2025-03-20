namespace State {
    array<TeamVM@> TTATeams = {};
    array<PlayerVM@> TTAPlayers = {};
    array<string> TTATeamNames = {};
    array<array<string>@> TTAPlayerNames = {};
    array<string> TTAFlatPlayerNames = {};

    bool TTAIsLoaded = false;

    void LoadTTASettings() {
        LogTrace("Loading TTASettings..");

        TTATeamNames = ParseStringArraySetting(S_TTA_TeamNames);
        
        TTAPlayerNames = {}; 
        TTAFlatPlayerNames = {};
        array<string> playersOnTeam = ParseStringArraySetting(S_TTA_Players);
        for (uint i = 0; i < playersOnTeam.Length; i++) {
            array<string> players = ParseStringArraySetting(playersOnTeam[i], ",");
            TTAPlayerNames.InsertLast(players);
            for (uint j = 0; j < players.Length; j++) {
                TTAFlatPlayerNames.InsertLast(players[j]);
            }
        }

        LogTrace("Loaded TTASettings");
        LogTrace("TTATeamNames:\n" + ArrayToString(TTATeamNames));
        LogTrace("TTAFlatPlayerNames:\n" + ArrayToString(TTAFlatPlayerNames));
    }

    void LoadTTA() {
        LoadTTASettings();
        AccountMgr::Init(TTAFlatPlayerNames);
        
        for (uint i = 0; i < TTAPlayerNames.Length; i++) {
            auto teamName = (TTATeamNames.Length - 1 < i) ? ("Team " + (i + 1)) : TTATeamNames[i];
            TTATeams.InsertLast(TeamVM(teamName, i));

            for (uint j = 0; j < TTAPlayerNames[i].Length; j++) {
                TTAPlayers.InsertLast(PlayerVM(TTAPlayerNames[i][j], i));
                TTATeams[TTATeams.Length - 1].players.InsertLast(TTAPlayers[TTAPlayers.Length - 1]);
            }

            TTATeams[TTATeams.Length - 1].players.SortAsc();
        }

        LogTrace("Loaded TTA");
    }

    void UpdateTTA(CTrackMania@ app) {
        if (!TTAIsLoaded) {
            LoadTTA();
            TTAIsLoaded = true;
        }

        LogTrace("Updating TTA State..");

        auto map = app.RootMap;
        TimeMgr::UpdateTimes(TTAPlayers, (!S_TTA_LockMapUid && map !is null && map.MapInfo.MapUid != "" && app.Editor is null) ? map.MapInfo.MapUid : S_TTA_MapUid);
        for (uint i = 0; i < TTATeams.Length; i++) {
            TTATeams[i].players.SortAsc();
        }
        TTATeams.SortAsc();

        LogTrace("Updated TTA State");
    }
}