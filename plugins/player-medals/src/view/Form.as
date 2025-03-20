namespace View {
    // TODO: these forms should handle the action buttons
    // such that they can be disabled if the form data
    // is invalid

    bool MapForm(const string&in id, Domain::Map@ map, bool disabled = false, bool showAlwaysDisabled = true, bool showTooltips = true) {
        if (id.Length < 1) return false;
        if (map is null) return false;

        if (showAlwaysDisabled) {
            UI::BeginDisabled();

            UI::InputText(Label("Map Uid", id, "mapUid"), map.mapUid);
            UI::InputText(Label("Author", id, "authorTime"), tostring(map.authorTime));

            UI::EndDisabled();
        }

        UI::BeginDisabled(disabled);
        map.name = UI::InputText(Label("Name", id, "name"), map.name).Trim();
        if (showTooltips) Tooltip("Format must match 'Winter 2025 - 01' for official campaigns.");
        UI::EndDisabled();

        UI::BeginDisabled(map.totdDate.Length > 0 || map.campaign.Length > 0 || map.campaignIndex > -1 || disabled);
        map.nadeo = UI::Checkbox(Label("Is map in official campaign?", id, "nadeo"), map.nadeo);
        if (showTooltips) Tooltip("Currently this uses map author to determine, so it may not be accurate. Change the value if it's wrong. Leave unchecked if totd.");

        if (map.nadeo) {
            map.totdDate = "";
            map.campaign = "";
            map.campaignIndex = -1;
        }
        UI::EndDisabled();

        UI::BeginDisabled(map.nadeo || map.campaign.Length > 0 || map.campaignIndex > -1 || disabled);
        map.totdDate = UI::InputText(Label("TOTD Date", id, "totdDate"), map.totdDate).Trim();
        if (showTooltips) Tooltip("Format must match '2025-01-01'. Leave empty if not a track of the day.");
        
        if (map.totdDate.Length > 0) {
            map.nadeo = false;
            map.campaign = "";
            map.campaignIndex = -1;
        }
        UI::EndDisabled();

        UI::BeginDisabled(map.nadeo || map.totdDate.Length > 0 || disabled);
        map.campaign = UI::InputText(Label("Campaign", id, "campaign"), map.campaign).Trim();
        if (showTooltips) Tooltip("Leave empty if official or totd. Not currently supported.");

        if (map.campaign.Length > 0) {
            map.nadeo = false;
            map.totdDate = "";
        }

        auto campaignIndex = UI::InputInt(Label("Campaign Index", id, "campaignIndex"), map.campaignIndex);
        if (campaignIndex >= -1) map.campaignIndex = campaignIndex;
        if (showTooltips) Tooltip("Leave -1 if official or totd. Not currently supported.");
        UI::EndDisabled();

        return true;
    }

    bool PlayerForm(const string&in id, Domain::Player@ player, bool disabled = false, bool showAlwaysDisabled = true, bool showTooltips = true) {
        if (id.Length < 1) return false;
        if (player is null) return false;

        if (showAlwaysDisabled) {
            UI::BeginDisabled();

            UI::InputText(Label("Account Id", id, "accountId"), player.accountId);

            UI::EndDisabled();
        }
        
        UI::BeginDisabled(disabled);

        player.name = UI::InputText(Label("Name", id, "name"), player.name).Trim();
        if (showTooltips) Tooltip("In game name. Only change if inaccurate. Updating display name is preferred to change viewable name.");

        player.color = UI::InputText(Label("Color (3 Hex)", id, "color"), player.color, UI::InputTextFlags::CharsHexadecimal).Trim().ToUpper();
        if (showTooltips) Tooltip("Format must match 'FFF'. Must be 3 characters and valid hex (0-9, A-F).");

        player.displayName = UI::InputText(Label("Display Name", id, "displayName"), player.displayName).Trim();
        if (showTooltips) Tooltip("Visible name in the plugin. Leave empty to use name.");

        UI::EndDisabled();

        return true;
    }

    bool MedalTimeForm(const string&in id, Domain::MedalTime@ medalTime, bool disabled = false, bool showAlwaysDisabled = true, bool showTooltips = true) {
        if (id.Length < 1) return false;
        if (medalTime is null) return false;

        if (showAlwaysDisabled) {
            UI::BeginDisabled();

            UI::InputText(Label("Map Uid", id, "mapUid"), medalTime.mapUid);
            UI::InputText(Label("Account Id", id, "accountId"), medalTime.accountId);
            UI::InputInt(Label("Medal Time", id, "medalTime"), medalTime.medalTime);

            UI::EndDisabled();
        }
        
        UI::BeginDisabled(disabled);

        auto customMedalTime = UI::InputInt(Label("Custom Medal Time", id, "customMedalTime"), medalTime.customMedalTime);
        if (customMedalTime >= -1) medalTime.customMedalTime = customMedalTime;
        if (showTooltips) Tooltip("Overrides the medal time. Set -1 to use medal time. Should set 'Reason' if set.");

        medalTime.reason = UI::InputText(Label("Reason", id, "reason"), medalTime.reason).Trim();
        if (showTooltips) Tooltip("Reason for custom medal time. Leave empty if no 'Custom Medal Time'.");

        UI::EndDisabled();

        return true;
    }
}