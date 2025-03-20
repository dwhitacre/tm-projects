namespace Interface {
    void RenderCampaignBountyName() {
        if (S_Campaign_ShowBountyName)
        {
            UI::BeginTable("Campaign_BountyName", 1, UI::TableFlags::SizingFixedFit);
            UI::TableNextRow();
            UI::TableNextColumn();
            RenderStyledText(State::PluginDisplayName, S_TTA_BountyNameColor);
            UI::EndTable();
        }
    }

    void RenderLeaderboardRankings(array<LeaderboardRanking@>@ rankings) {
        bool isRb = S_Campaign_GroupHighlightRainbow;
        bool containsYou = false;
        
        for (uint i = 0; i < rankings.Length; i++) {
            if (i >= S_Campaign_GroupNumRecords) continue;

            bool isYou = rankings[i].accountId == S_Campaign_GroupHighlightYourAccountId;
            bool shouldHighlight = isYou && S_Campaign_GroupHighlight;
            containsYou = containsYou || isYou;

            UI::TableNextRow();
            UI::TableNextColumn();
            RenderStyledText(Text::Format("%d", rankings[i].position), shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightPositionColor) : S_Campaign_GroupPlayerPositionColor);
            UI::TableNextColumn();
            RenderStyledText(rankings[i].name, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightNameColor) : S_Campaign_GroupPlayerNameColor);
            if (S_Campaign_ShowGroupPlayerZone) {
                UI::TableNextColumn();
                RenderStyledText(rankings[i].zoneName, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightZoneColor) : S_Campaign_GroupPlayerZoneColor);
            }
            UI::TableNextColumn();
            RenderStyledText(rankings[i].sp, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightScoreColor) : S_Campaign_GroupPlayerScoreColor);

        }

        if (!containsYou && S_Campaign_AlwaysShowYou) {
            for (uint i = 0; i < State::CampaignYLB.tops.Length; i++) {
                if (State::CampaignYLB.tops[i].zoneName == S_Campaign_ZoneName) {
                    UI::TableNextRow();
                    UI::TableNextColumn();
                    RenderStyledText(Text::Format("%d", State::CampaignYLB.tops[i].rankings[0].position), S_Campaign_GroupHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightPositionColor) : S_Campaign_GroupPlayerPositionColor);
                    UI::TableNextColumn();
                    RenderStyledText(State::CampaignYLB.tops[i].rankings[0].name, S_Campaign_GroupHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightNameColor) : S_Campaign_GroupPlayerNameColor);
                    if (S_Campaign_ShowGroupPlayerZone) {
                        UI::TableNextColumn();
                        RenderStyledText(State::CampaignYLB.tops[i].rankings[0].zoneName, S_Campaign_GroupHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightZoneColor) : S_Campaign_GroupPlayerZoneColor);
                    }
                    UI::TableNextColumn();
                    RenderStyledText(State::CampaignYLB.tops[i].rankings[0].sp, S_Campaign_GroupHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_GroupHighlightScoreColor) : S_Campaign_GroupPlayerScoreColor);
                }
            }
        }
    }

    void RenderMapLeaderboardRankings(array<LeaderboardRanking@>@ rankings) {
        bool isRb = S_Campaign_MapHighlightRainbow;
        
        for (uint i = 0; i < rankings.Length; i++) {
            if (i >= S_Campaign_MapNumRecords) continue;

            bool isYou = rankings[i].accountId == S_Campaign_GroupHighlightYourAccountId;
            bool shouldHighlight = isYou && S_Campaign_MapHighlight;

            UI::TableNextRow();
            UI::TableNextColumn();
            RenderStyledText(Text::Format("%d", rankings[i].position), shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_MapHighlightPositionColor) : S_Campaign_MapPlayerPositionColor);
            UI::TableNextColumn();
            RenderStyledText(rankings[i].name, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_MapHighlightNameColor) : S_Campaign_MapPlayerNameColor);
            if (S_Campaign_ShowMapPlayerZone) {
                UI::TableNextColumn();
                RenderStyledText(rankings[i].zoneName, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_MapHighlightZoneColor) : S_Campaign_MapPlayerZoneColor);
            }
            UI::TableNextColumn();
            RenderTime(Text::ParseInt(rankings[i].sp), shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_MapHighlightScoreColor) : S_Campaign_MapPlayerScoreColor);
        }
    }

    void RenderGroupLeaderboard() {
        if (S_Campaign_ShowGroupLeaderboard)
        {
            if (S_Campaign_ShowGroupHeader) RenderStyledText("Campaign Leaderboard", S_Campaign_GroupHeaderColor);

            int numCols = S_Campaign_ShowGroupPlayerZone ? 4 : 3;
            if (UI::BeginTable("Campaign_GLB_Table", numCols, UI::TableFlags::SizingFixedFit)) {
                for (uint i = 0; i < State::CampaignGLB.tops.Length; i++) {
                    if (State::CampaignGLB.tops[i].zoneName == S_Campaign_ZoneName) {
                        UI::TableNextRow();
                        RenderLeaderboardRankings(State::CampaignGLB.tops[i].rankings);
                        UI::TableNextRow();
                    }
                }
                UI::EndTable();
            }
        }
    }

    void RenderMapLeaderboards() {
        if (S_Campaign_ShowMapLeaderboard)
        {
            if (S_Campaign_ShowMapHeader) RenderStyledText("Map Leaderboard", S_Campaign_MapHeaderColor);

            int numCols = S_Campaign_ShowMapPlayerZone ? 4 : 3;
            for (uint i = 0; i < State::CampaignMLBs.Length; i++) {
                if (S_Campaign_ShowMapName) RenderStyledText(State::CampaignMLBs[i].mapName, S_Campaign_MapNameColor);

                if (UI::BeginTable("Campaign_MLBs_Table" + State::CampaignMLBs[i].mapUid, numCols, UI::TableFlags::SizingFixedFit)) {
                    for (uint j = 0; j < State::CampaignMLBs[i].tops.Length; j++) {
                        if (State::CampaignMLBs[i].tops[j].zoneName == S_Campaign_ZoneName) {
                            UI::TableNextRow();
                            RenderMapLeaderboardRankings(State::CampaignMLBs[i].tops[j].rankings);
                            UI::TableNextRow();
                        }
                    }
                    UI::EndTable();
                }
            }

        }
    }

    void RenderPrizeLeaderboards() {
        if (S_Campaign_ShowPrizeLeaderboard)
        {
            if (S_Campaign_ShowPrizeHeader) RenderStyledText("Prize Leaderboard", S_Campaign_PrizeHeaderColor);

            int numCols = S_Campaign_ShowPrizePlayerZone ? 4 : 3;
            bool isRb = S_Campaign_PrizeHighlightRainbow;

            if (UI::BeginTable("Campaign_Prize_Table", numCols, UI::TableFlags::SizingFixedFit)) {
                for (uint i = 0; i < State::CampaignGLB.tops.Length; i++) {
                    if (State::CampaignGLB.tops[i].zoneName == S_Campaign_ZoneName) {
                        bool isYou = State::CampaignGLB.tops[i].rankings[0].accountId == S_Campaign_GroupHighlightYourAccountId;
                        bool shouldHighlight = isYou && S_Campaign_PrizeHighlight;
                        
                        UI::TableNextRow();
                        UI::TableNextColumn();
                        RenderStyledText("Campaign Winner", shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightCategoryColor) : S_Campaign_PrizeCategoryColor);
                        
                        UI::TableNextColumn();
                        RenderStyledText(State::CampaignGLB.tops[i].rankings[0].name, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightPlayerColor) : S_Campaign_PrizePlayerColor);
                        
                        if (S_Campaign_ShowPrizePlayerZone) {
                            UI::TableNextColumn();
                            RenderStyledText(State::CampaignGLB.tops[i].rankings[0].zoneName, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightZoneColor) : S_Campaign_PrizeZoneColor);
                        }
                        
                        UI::TableNextColumn();
                        RenderStyledText(Text::Format("$%d", S_Campaign_OverallPrizeAmount), shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightPrizeColor) : S_Campaign_PrizePrizeColor);
                    }
                }
                
                for (uint i = 0; i < State::CampaignMLBs.Length; i++) {
                    for (uint j = 0; j < State::CampaignMLBs[i].tops.Length; j++) {
                        if (State::CampaignMLBs[i].tops[j].zoneName == S_Campaign_ZoneName) {
                            bool isYou = State::CampaignMLBs[i].tops[j].rankings[0].accountId == S_Campaign_GroupHighlightYourAccountId;
                            bool shouldHighlight = isYou && S_Campaign_PrizeHighlight;
                            
                            UI::TableNextRow();
                            UI::TableNextColumn();
                            RenderStyledText(State::CampaignMLBs[i].mapName, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightCategoryColor) : S_Campaign_PrizeCategoryColor);
                            
                            UI::TableNextColumn();
                            RenderStyledText(State::CampaignMLBs[i].tops[j].rankings[0].name, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightPlayerColor) : S_Campaign_PrizePlayerColor);
                            
                            if (S_Campaign_ShowPrizePlayerZone) {
                                UI::TableNextColumn();
                                RenderStyledText(State::CampaignMLBs[i].tops[j].rankings[0].zoneName, shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightZoneColor) : S_Campaign_PrizeZoneColor);
                            }
                            
                            UI::TableNextColumn();
                            RenderStyledText(Text::Format("$%d", S_Campaign_MapPrizeAmount), shouldHighlight ? (isRb ? S_Campaign_GroupHighlightRainbowColor : S_Campaign_PrizeHighlightPrizeColor) : S_Campaign_PrizePrizeColor);
                        }
                    }
                }
                
                UI::EndTable();
            }

        }
    }

    void RenderCampaign() {
        State::UpdateIsInBountyMap();
        RenderCampaignBountyName();

        if (State::CampaignIsLoaded) {
            RenderGroupLeaderboard();
            RenderMapLeaderboards();
            RenderPrizeLeaderboards();
            if (S_Campaign_GroupHighlightRainbow || S_Campaign_MapHighlightRainbow || S_Campaign_PrizeHighlightRainbow) S_Campaign_GroupHighlightRainbowColor = Rainbow(S_Campaign_GroupHighlightRainbowColor);
        } else {
            RenderStyledText("Loading Campaign... Please wait..");
        }
    }
}