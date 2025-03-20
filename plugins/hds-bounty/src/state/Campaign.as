namespace State {
    Campaign CampaignData;
    GroupLeaderboard CampaignGLB;
    GroupLeaderboard CampaignYLB;
    array<GroupLeaderboard@> CampaignMLBs = {};

    bool CampaignIsLoaded = false;

    void LoadCampaign(CTrackMania@ app) {
        CampaignData = Api::GetClubCampaign(S_Campaign_CampaignId);
        // S_Campaign_GroupHighlightYourAccountId = "f77223ad-cddc-466e-8680-38edc9057f2d";
        S_Campaign_GroupHighlightYourAccountId = NadeoServices::GetAccountID();
        LoadLeaderboards();
        for (uint i = 0; i < CampaignData.playlist.Length; i++) {
            CampaignMLBs.InsertAt(i, Api::GetMapLeaderboard(CampaignData.leaderboardGroupUid, CampaignData.playlist[i].uid));
        }
    }

    void UpdateIsInBountyMap() {
        if (CampaignIsLoaded && S_Window_HideWhenNotInBountyMap) {
            auto app = cast<CTrackMania>(GetApp());
            auto map = app.RootMap;
            bool isInBountyMap = false;

            if (map !is null && app.Editor is null && map.MapInfo.MapUid != "") {
                for (uint i = 0; i < CampaignData.playlist.Length; i++) {
                    isInBountyMap = isInBountyMap || CampaignData.playlist[i].uid == map.MapInfo.MapUid;
                }
            }
            S_Window_IsInBountyMap = isInBountyMap;
        }
    }

    void LoadLeaderboards() {
        CampaignGLB = Api::GetGroupLeaderboard(CampaignData.leaderboardGroupUid);
        CampaignYLB = Api::GetYourLeaderboard(CampaignData.leaderboardGroupUid, S_Campaign_GroupHighlightYourAccountId);
    }

    void UpdateMapLeaderboards() {
        for (uint i = 0; i < CampaignData.playlist.Length; i++) {
            CampaignMLBs[i] = Api::GetMapLeaderboard(CampaignData.leaderboardGroupUid, CampaignData.playlist[i].uid);
        }
    }

    void UpdateCampaign(CTrackMania@ app) {
        if (!CampaignIsLoaded) {
            LoadCampaign(app);
            CampaignIsLoaded = true;
        } else {
            LogTrace("Updating Campaign State..");
            LoadLeaderboards();
            UpdateMapLeaderboards();
            LogTrace("Updated Campaign State");
        }

    }
}
