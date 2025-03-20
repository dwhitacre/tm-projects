namespace Interface {
    int64 getTimeLeft() {
        return (S_Birthday_CountdownStartTime - Time::get_Stamp()) * 1000;
    }

    bool shouldRenderCountdown() {
        return S_Birthday_ShowCountdown && getTimeLeft() >= 0;
    }

    void RenderBirthdayBountyName() {
        if (S_Birthday_ShowBountyName)
        {
            UI::BeginTable("Birthday_BountyName", 1, UI::TableFlags::SizingFixedFit);
            UI::TableNextRow();
            UI::TableNextColumn();
            RenderStyledText(Icons::BirthdayCake + " " + S_Birthday_BountyName, S_Birthday_BountyNameRainbow ? S_Birthday_RainbowColor : S_Birthday_BountyNameColor);
            UI::EndTable();
        }
    }

    void RenderCountdown() {
        if (State::BigFont is null) return;
        UI::PushFont(State::BigFont);
        RenderStyledText(Time::Format(getTimeLeft(), false, true, true), S_Birthday_CountdownRainbow ? S_Birthday_RainbowColor : S_Birthday_CountdownColor);
        UI::PopFont();
    }

    void RenderGoalPlayerTime() {
        if (State::BirthdayGoalPlayer is null) return;

        UI::TableNextRow();
        if (S_Birthday_ShowPlayerLabel) {
            UI::TableNextColumn();
            RenderStyledText(S_Birthday_GoalPlayerLabel, S_Birthday_GoalPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_GoalPlayerLabelColor);
        }
        UI::TableNextColumn();
        RenderStyledText(State::BirthdayGoalPlayer.name, S_Birthday_GoalPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_GoalPlayerNameColor);
        UI::TableNextColumn();
        RenderTime(State::BirthdayGoalPlayer.time, S_Birthday_GoalPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_GoalPlayerScoreColor);
    }

    void RenderCurrentPlayerTime() {
        if (State::BirthdayCurrentPlayer is null) return;

        UI::TableNextRow();
        if (S_Birthday_ShowPlayerLabel) {
            UI::TableNextColumn();
            RenderStyledText(S_Birthday_CurrentPlayerLabel, S_Birthday_CurrentPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_CurrentPlayerLabelColor);
        }
        UI::TableNextColumn();
        RenderStyledText(State::BirthdayCurrentPlayer.name, S_Birthday_CurrentPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_CurrentPlayerNameColor);
        UI::TableNextColumn();
        RenderTime(State::BirthdayCurrentPlayer.time, S_Birthday_CurrentPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_CurrentPlayerScoreColor);
    }

    void RenderTopPlayerTime() {
        if (State::BirthdayTopPlayer is null) return;

        UI::TableNextRow();
        if (S_Birthday_ShowPlayerLabel) {
            UI::TableNextColumn();
            RenderStyledText(S_Birthday_TopPlayerLabel, S_Birthday_TopPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_TopPlayerLabelColor);
        }
        UI::TableNextColumn();
        RenderStyledText(State::BirthdayTopPlayer.name, S_Birthday_TopPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_TopPlayerNameColor);
        UI::TableNextColumn();
        RenderTime(State::BirthdayTopPlayer.time, S_Birthday_TopPlayerRainbow ? S_Birthday_RainbowColor : S_Birthday_TopPlayerScoreColor);
    }


    void RenderBirthdayMode() {
        if (!State::BirthdayIsLoaded) {
            RenderStyledText("Loading Birthday... Please wait..");
            return;
        }

        int numCols = S_Birthday_ShowPlayerLabel ? 3 : 2;
        if (UI::BeginTable("Birthday_Table", numCols, UI::TableFlags::SizingFixedFit)) {
            for (uint i = 0; i < State::BirthdayPlayers.Length; i++) {
                if (State::BirthdayPlayers[i] is State::BirthdayTopPlayer) {
                    RenderTopPlayerTime();
                } else if (State::BirthdayPlayers[i] is State::BirthdayGoalPlayer) {
                    RenderGoalPlayerTime();
                } else if (State::BirthdayPlayers[i] is State::BirthdayCurrentPlayer) {
                    RenderCurrentPlayerTime();
                }
            }
            UI::EndTable();
        }
    }

    void RenderDiscordButton() {
        if (UI::Button(Icons::DiscordAlt + " Bounty Discord")) OpenBrowserURL(S_Birthday_DiscordLink);
    }

    void RenderBirthday() {
        State::UpdateIsInBirthdayBountyMap();
        RenderBirthdayBountyName();
        if (shouldRenderCountdown()) RenderCountdown();
        else RenderBirthdayMode();
        RenderDiscordButton();
        if (S_Birthday_BountyNameRainbow || S_Birthday_CountdownRainbow || S_Birthday_GoalPlayerRainbow || S_Birthday_CurrentPlayerRainbow || S_Birthday_TopPlayerRainbow) S_Birthday_RainbowColor = Rainbow(S_Birthday_RainbowColor, S_Birthday_RainbowInterval);
    }
}