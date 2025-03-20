[SettingsTab name="General" icon="Cogs"]
void Settings_General() {
    View::Settings.RenderGeneral();
}

[SettingsTab name="Dev" icon="Bug" order=1]
void Settings_Debug() {
    View::Settings.RenderDebug();
}

namespace View {
    class SettingsWindow : Window {
        SettingsWindow() {
            super();
        }

        void RenderGeneral() {
            Header("Medal Time Player");
            Tooltip("Players offer different medal times and maps.");

            UI::BeginDisabled(Services::Loading);
            
            if (UI::BeginCombo("##currentplayer", Services::CurrentPlayer.exists ? Services::CurrentPlayer.player.viewName : "Select a player")) {
                auto players = Services::Players.GetPlayers();
                for (uint i = 0; i < players.Length; i++) {
                    auto player = cast<Domain::Player@>(players[i]);
                    if (UI::Selectable(player.viewName, Services::CurrentPlayer.accountId == player.accountId)) {
                        trace("Selecting new player: " + player.accountId + ", " + player.viewName);
                        Services::CurrentPlayer.accountId = player.accountId;
                        
                        // TODO: This is probably overkill, but reloading the plugin
                        // was the previous way to set a new current player.
                        startnew(Services::Reset);
                    }
                }

                UI::EndCombo();
            }

            UI::EndDisabled();
            
            UI::NewLine();
            UI::Separator();
            UI::NewLine();

            Header("Main Window");

            if (UI::Button("Reset to default##main")) {
                Services::Settings.mainWindow.Reset();
            }

            Services::Settings.mainWindow.enabled = UI::Checkbox("Show main window", Services::Settings.mainWindow.enabled);
            Services::Settings.mainWindow.showWithGame = !UI::Checkbox("Hide when Game UI is hidden##main", !Services::Settings.mainWindow.showWithGame);
            Services::Settings.mainWindow.showWithOpenplanet = !UI::Checkbox("Hide when Openplanet is hidden##main", !Services::Settings.mainWindow.showWithOpenplanet);
            Services::Settings.mainWindow.autoResize = UI::Checkbox("Should auto-resize", Services::Settings.mainWindow.autoResize);

            UI::NewLine();
            UI::Separator();
            UI::NewLine();

            Header("Medal Window");

            if (UI::Button("Reset to default##medal")) {
                Services::Settings.medalWindow.Reset();
            }

            Services::Settings.medalWindow.enabled = UI::Checkbox("Show medal window", Services::Settings.medalWindow.enabled);
            Services::Settings.medalWindow.showWithGame = !UI::Checkbox("Hide when Game UI is hidden##medal", !Services::Settings.medalWindow.showWithGame);
            Services::Settings.medalWindow.showWithOpenplanet = !UI::Checkbox("Hide when Openplanet is hidden##medal", !Services::Settings.medalWindow.showWithOpenplanet);
            Services::Settings.medalWindow.delta = UI::Checkbox("Show delta", Services::Settings.medalWindow.delta);
            if (!Services::Me.HasViewPermissionOnly()) {
                Services::Settings.medalWindow.showManage = UI::Checkbox("Show manager", Services::Settings.medalWindow.showManage);
                Services::Settings.medalWindow.showManageWithOpenplanet = !UI::Checkbox("Hide manager when Openplanet is hidden##medalmanager", !Services::Settings.medalWindow.showManageWithOpenplanet);
                Services::Settings.medalWindow.showManageTabs = UI::Checkbox("Show manager as tabs", Services::Settings.medalWindow.showManageTabs);
                Tooltip("If unchecked, the manager will show as a collapsible headers.");
                Services::Settings.medalWindow.showManagePlayer = UI::Checkbox("Show player manage in manager", Services::Settings.medalWindow.showManagePlayer);
                Services::Settings.medalWindow.showManageMap = UI::Checkbox("Show map manage in manager", Services::Settings.medalWindow.showManageMap);
                Services::Settings.medalWindow.showManageMedalTime = UI::Checkbox("Show medal time manage in manager", Services::Settings.medalWindow.showManageMedalTime);
            }

            UI::NewLine();
            UI::Separator();
            UI::NewLine();

            Header("Colors");

            if (UI::Button("Reset to default##colors")) {
                Services::Settings.colors.Reset();
            }

            Services::Settings.colors.winter = UI::InputColor3("Winter / Jan-Mar", Services::Settings.colors.winter);
            Services::Settings.colors.spring = UI::InputColor3("Spring / Apr-Jun", Services::Settings.colors.spring);
            Services::Settings.colors.summer = UI::InputColor3("Summer / Jul-Sep", Services::Settings.colors.summer);
            Services::Settings.colors.fall   = UI::InputColor3("Fall / Oct-Dec",   Services::Settings.colors.fall);

            UI::NewLine();
            UI::Separator();
            UI::NewLine();

            Header("UI Medals");

            if (UI::Button("Reset to default##uimedals")) {
                Services::Settings.uiMedals.Reset();
            }

            Services::Settings.uiMedals.enabled = UI::Checkbox("Show medal in UI", Services::Settings.uiMedals.enabled);

            UI::NewLine();
            SubHeader("Main Menu");

            Services::Settings.uiMedals.seasonalCampaign = UI::Checkbox("Seasonal campaign", Services::Settings.uiMedals.seasonalCampaign);
            Services::Settings.uiMedals.liveCampaign = UI::Checkbox("Seasonal campaign (live)", Services::Settings.uiMedals.liveCampaign);
            Tooltip("In the arcade");
            Services::Settings.uiMedals.totd = UI::Checkbox("Track of the Day", Services::Settings.uiMedals.totd);
            // Services::Settings.uiMedals.liveTotd = UI::Checkbox("Track of the Day (live)", Services::Settings.uiMedals.liveTotd);
            Services::Settings.uiMedals.clubCampaign = UI::Checkbox("Club Campaign", Services::Settings.uiMedals.clubCampaign);
            Tooltip("May be inaccurate as it only checks the name of the campaign");
            // Services::Settings.uiMedals.training = UI::Checkbox("Training", Services::Settings.uiMedals.training);

            UI::NewLine();
            SubHeader("Playing");

            Services::Settings.uiMedals.banner = UI::Checkbox("Record banner", Services::Settings.uiMedals.banner);
            Tooltip("Shows at the top-left in a live match");
            Services::Settings.uiMedals.start = UI::Checkbox("Start menu", Services::Settings.uiMedals.start);
            Tooltip("Only shows in solo");
            Services::Settings.uiMedals.pause = UI::Checkbox("Pause menu", Services::Settings.uiMedals.pause);
            Services::Settings.uiMedals.end = UI::Checkbox("End menu", Services::Settings.uiMedals.end);
            Tooltip("Only shows in solo");

            UI::NewLine();
        }

        void RenderDebug() {
            Header("API");
            Tooltip("Reload the plugin after changing these settings.");

            if (UI::Button("Reset to default##api")) {
                Services::Settings.options.Reset();
            }

            Services::Settings.options.baseUrl = UI::InputText("Base Url", Services::Settings.options.baseUrl);
            Services::Settings.options.apikey = UI::InputText("API Key", Services::Settings.options.apikey, false, UI::InputTextFlags::Password);
            auto value = UI::InputInt("Latency", Services::Settings.options.latency);
            if (value >= 0) Services::Settings.options.latency = value;
            Services::Settings.options.debug = UI::Checkbox("Debug", Services::Settings.options.debug);

            UI::NewLine();
            UI::Separator();
            UI::NewLine();

            Header("Debug");
            UI::Text("This information is for debugging purposes.");
            UI::Text("If you are reporting an issue, it can be useful to include a screenshot of this information.");
            UI::NewLine();

            UI::BeginTabBar("##settings-debug-tab-bar");

            RenderDebugMe();
            RenderDebugCurrentPlayer();
            RenderDebugCurrentPlayerMedalTimes();
            RenderDebugMaps();
            RenderDebugCampaigns();
            RenderDebugPBs();
            
            UI::EndTabBar();
        }

        void RenderDebugMe() {
            if (UI::BeginTabItem("Me")) {
                SubHeader("Me");
                
                auto me = Services::Me.Get();
                if (me is null) {
                    UI::Text("No account found.");
                    UI::EndTabItem();
                    return;
                }

                View::Table("##settings_debug_me", me.Columns(), { me.ToJson() });

                UI::EndTabItem();
            }
        }

        void RenderDebugCurrentPlayer() {
            if (UI::BeginTabItem("Current Player")) {
                SubHeader("Current Player");
                
                auto player = Services::CurrentPlayer.player;
                if (!Services::CurrentPlayer.exists) {
                    UI::Text("No current player.");
                    UI::EndTabItem();
                    return;
                }

                View::Table("##settings_debug_currentplayer", player.Columns(), { player.ToJson() });

                UI::EndTabItem();
            }
        }

        void RenderDebugCurrentPlayerMedalTimes() {
            if (UI::BeginTabItem("Current Player Medal Times")) {
                SubHeader("Current Player Medal Times");

                if (!Services::CurrentPlayer.exists) {
                    UI::Text("No current player to get medal times.");
                    UI::EndTabItem();
                    return;
                }
                
                auto medalTimes = Services::CurrentPlayer.GetMedalTimes();
                if (medalTimes.Length < 1) {
                    UI::Text("No current player medal times.");
                    UI::EndTabItem();
                    return;
                }

                array<Json::Value@> data = {};
                for (uint i = 0; i < medalTimes.Length; i++) {
                    data.InsertLast(medalTimes[i].ToJson());
                }        
                View::Table("##settings_debug_currentplayermedaltimes", medalTimes[0].Columns(), data);

                UI::EndTabItem();
            }
        }

        void RenderDebugMaps() {
            if (UI::BeginTabItem("Maps")) {
                SubHeader("Maps");
                
                auto maps = Services::Maps.GetMaps();
                if (maps.Length < 1) {
                    UI::Text("No maps.");
                    UI::EndTabItem();
                    return;
                }

                array<Json::Value@> data = {};
                for (uint i = 0; i < maps.Length; i++) {
                    data.InsertLast(maps[i].ToJson());
                }        
                View::Table("##settings_debug_maps", maps[0].Columns(), data);

                UI::EndTabItem();
            }
        }

        void RenderDebugCampaigns() {
            if (UI::BeginTabItem("Campaigns")) {
                SubHeader("Campaigns");
                
                auto campaigns = Services::Maps.GetCampaigns();
                if (campaigns.Length < 1) {
                    UI::Text("No campaigns.");
                    UI::EndTabItem();
                    return;
                }

                array<Json::Value@> data = {};
                for (uint i = 0; i < campaigns.Length; i++) {
                    data.InsertLast(campaigns[i].ToJson());
                }        
                View::Table("##settings_debug_campaigns", campaigns[0].Columns(), data);

                UI::EndTabItem();
            }
        }

        void RenderDebugPBs() {
            if (UI::BeginTabItem("PBs")) {
                SubHeader("PBs");
                
                auto pbs = Services::PBs.GetPBs();
                if (pbs.Length < 1) {
                    UI::Text("No pbs.");
                    UI::EndTabItem();
                    return;
                }

                array<Json::Value@> data = {};
                for (uint i = 0; i < pbs.Length; i++) {
                    data.InsertLast(pbs[i].ToJson());
                }        
                View::Table("##settings_debug_pbs", pbs[0].Columns(), data);

                UI::EndTabItem();
            }
        }
    }
}