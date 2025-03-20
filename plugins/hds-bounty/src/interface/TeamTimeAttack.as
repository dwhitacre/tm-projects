namespace Interface {
    void RenderTTABountyName() {
        if (S_TTA_ShowBountyName)
        {
            UI::BeginTable("TTA_BountyName", 1, UI::TableFlags::SizingFixedFit);
            UI::TableNextRow();
            UI::TableNextColumn();
            RenderStyledText(State::PluginDisplayName, S_TTA_BountyNameColor);
            UI::EndTable();
        }
    }

    void RenderTTAHeader(const string &in name) {
        if (S_TTA_ShowHeader) {
            UI::TableNextRow();
            
            UI::TableNextColumn();
            RenderStyledText("Name", S_TTA_HeaderColor);
            UI::TableNextColumn();
            RenderStyledText("Time", S_TTA_HeaderColor);

            if (S_TTA_ShowTeamAverageTimes) {
                UI::TableNextColumn();
                RenderStyledText("Avg", S_TTA_HeaderColor);
            }
        }
        
    }

    void RenderTTATeam(TeamVM@ team) {
        UI::TableNextColumn();
        RenderStyledText(team.name, S_TTA_TeamColor);
        UI::TableNextColumn();
        RenderTime(team.totalTime, S_TTA_TeamTotalTimeColor);
        if (S_TTA_ShowTeamAverageTimes) {
            UI::TableNextColumn();
            RenderAvgTime(team.avgTime, S_TTA_TeamAverageTimeColor);
        }
    }

    void RenderTTATeamPlayers(TeamVM@ team) {
        if (S_TTA_ShowPlayersTimes) {
            for (uint j = 0; j < team.players.Length; j++) {
                UI::TableNextRow();
                UI::TableNextColumn();
                RenderStyledText(team.players[j].name, S_TTA_PlayerColor);
                UI::TableNextColumn();
                RenderTime(team.players[j].time, S_TTA_PlayerTimeColor);
            }
        }
    }

    void RenderTTA() {
        RenderTTABountyName();
        
        if (!State::TTAIsLoaded) {
            RenderStyledText("Loading TTA... Please wait..");
        }

        int numCols = S_TTA_ShowTeamAverageTimes ? 3 : 2;
        if (UI::BeginTable("TTA_Table", numCols, UI::TableFlags::SizingFixedFit)) {

            for (uint i = 0; i < State::TTATeams.Length; i++) {
                UI::TableNextRow();
                RenderTTATeam(State::TTATeams[i]);
                RenderTTATeamPlayers(State::TTATeams[i]);
                UI::TableNextRow();
            }
            UI::EndTable();
        }
    }
}