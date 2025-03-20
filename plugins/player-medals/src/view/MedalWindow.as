namespace View {
    class MedalWindow : Window {
        MedalWindow() {
            super();
        }

        void Render() {
            if (!Services::Settings.medalWindow.enabled) return;
            if (!Services::Settings.medalWindow.showWithGame && !UI::IsGameUIVisible()) return;
            if (!Services::Settings.medalWindow.showWithOpenplanet && !UI::IsOverlayShown()) return;
            if (!Services::Game::InMap()) return;

            const string mapUid = cast<CTrackMania@>(GetApp()).RootMap.EdChallengeId;
            if (!Services::CurrentPlayer.HasMedalTime(mapUid) && Services::Me.HasViewPermissionOnly()) return;    

            int flags = UI::WindowFlags::AlwaysAutoResize | UI::WindowFlags::NoTitleBar;
            if (!UI::IsOverlayShown())
                flags |= UI::WindowFlags::NoMove;

            if (UI::Begin("player-medals-window", Services::Settings.medalWindow.enabled, flags)) {
                RenderCurrentPlayerMedalTime(mapUid, false);
                RenderCurrentPlayerNoMedalTime(mapUid, false);

                if (!Services::Loading && Services::Settings.medalWindow.showManage && (Services::Settings.medalWindow.showManageWithOpenplanet || UI::IsOverlayShown())) {
                    UI::Separator();

                    if (Services::Settings.medalWindow.showManageTabs) UI::BeginTabBar("##manager-tab-bar");

                    if (Services::Settings.medalWindow.showManagePlayer) RenderPlayerManage(Services::Settings.medalWindow.showManageTabs);
                    if (Services::Settings.medalWindow.showManageMap) RenderMapManage(mapUid, Services::Settings.medalWindow.showManageTabs);
                    if (Services::Settings.medalWindow.showManageMedalTime) RenderMedalTimeManage(mapUid, Services::Settings.medalWindow.showManageTabs);

                    if (Services::Settings.medalWindow.showManageTabs) UI::EndTabBar();
                }

                UI::End();
            }
        }

        void RenderCurrentPlayerMedalTime(const string&in mapUid, bool inTabBar = true) {
            if (!Services::CurrentPlayer.HasMedalTime(mapUid)) return;
            if (inTabBar && !UI::BeginTabItem("Current##manager-tab-bar")) return;

            Domain::Map@ map = Services::Maps.GetMap(mapUid);
            Domain::MedalTime@ medalTime = Services::CurrentPlayer.GetMedalTime(map.mapUid);
            Domain::PB@ pb = Services::PBs.GetPB(map.mapUid);

            auto delta = Services::Settings.medalWindow.delta;
            if (UI::BeginTable("##table-times", delta ? 4 : 3)) {
                UI::TableNextRow();

                UI::TableNextColumn();
                UI::Image(Services::Icons.GetIcon32(), vec2(scale * 16.0f));

                UI::TableNextColumn();
                UI::Text(PlayerName());

                UI::TableNextColumn();
                UI::Text(Time::Format(medalTime.time));

                if (delta) {
                    UI::TableNextColumn();
                    if (pb is null) UI::Text(Services::PBsLoading ? "Loading.." : "");
                    else UI::Text((pb.HasMedalTime(medalTime) ? "\\$77F\u2212" : "\\$F77+") + Time::Format(uint(Math::Abs(pb.score - medalTime.time))));
                }

                UI::EndTable();
            }

            if (inTabBar) UI::EndTabItem();
        }

        void RenderCurrentPlayerNoMedalTime(const string&in mapUid, bool inTabBar = true) {
            if (Services::CurrentPlayer.HasMedalTime(mapUid)) return;
            if (Services::Me.HasViewPermissionOnly()) return;
            if (inTabBar && !UI::BeginTabItem("Current##manager-tab-bar")) return;
            
            UI::Text("No medal time set.");

            if (inTabBar) UI::EndTabItem();
        }

        void RenderMapManageNewMap(Domain::Map@ existingMap, Domain::Map@ currentMap) {
            if (existingMap !is null) return;
            
            if (!MapForm("mapManage_currentMap", currentMap, Services::MapSubmitting)) {
                UI::Text("No current map found.");
                UI::NewLine();
                return;
            }
            
            UI::BeginDisabled(Services::MapSubmitting);
            if (UI::Button("Submit" + (Services::MapSubmitting ? "ing.." : "") + " New Map")) {
                trace("Submitting new map: " + currentMap.mapUid);
                startnew(Services::SubmitMap, currentMap);
            }
            UI::EndDisabled();
        }

        void RenderMapManageExistingMapNoCurrent(Domain::Map@ existingMap, Domain::Map@ currentMap) {
            if (existingMap is null) return;
            if (currentMap !is null) return;

            if (!MapForm("mapManage_existingMap", existingMap, Services::MapSubmitting)) return;
            
            UI::BeginDisabled(Services::MapSubmitting);
            if (UI::Button("Updat" + (Services::MapSubmitting ? "ing.." : "e") + " Map")) {
                trace("Updating map no current: " + existingMap.mapUid);
                startnew(Services::SubmitMap, existingMap);
            }
            UI::EndDisabled();
        }

        void RenderMapManageExistingMap(Domain::Map@ existingMap, Domain::Map@ currentMap) {
            if (existingMap is null) return;
            if (currentMap is null) return;
            if (currentMap.mapUid != existingMap.mapUid) return;
            
            if (!MapForm("mapManage_existingMap", existingMap, true, true, false)) return;
            UI::Separator();
            if (!MapForm("mapManage_currentMap", currentMap, Services::MapSubmitting, false, true)) return;

            UI::BeginDisabled(Services::MapSubmitting);
            if (UI::Button("Updat" + (Services::MapSubmitting ? "ing.." : "e") + " Map")) {
                trace("Updating map: " + existingMap.mapUid);
                startnew(Services::SubmitMap, currentMap);
            }
            UI::EndDisabled();
        }

        void RenderMapManage(const string&in mapUid, bool inTabBar = true) {
            if (!Services::Me.HasPermission(Domain::Permission::MapManage)) return;
            if (inTabBar && !UI::BeginTabItem("Map##manager-tab-bar")) return;
            else if (!inTabBar && !UI::CollapsingHeader("Map")) return;

#if DEPENDENCY_MAPINFO
            Domain::Map@ existingMap = cast<Domain::Map@>(Services::Copy.Get("mapManage_existingMap_" + mapUid, Services::Maps.GetMap(mapUid)));
            Domain::Map@ currentMap = cast<Domain::Map@>(Services::Copy.Get("mapManage_currentMap_" + mapUid, Services::Game::GetCurrentMap()));
            
            RenderMapManageNewMap(existingMap, currentMap);
            RenderMapManageExistingMapNoCurrent(existingMap, currentMap);
            RenderMapManageExistingMap(existingMap, currentMap);

            UI::SameLine();
            UI::BeginDisabled(Services::MapSubmitting);
            if (UI::Button("Reset")) {
                trace("Resetting local cache map: " + mapUid);
                Services::Copy.Remove("mapManage_existingMap_" + mapUid);
                Services::Copy.Remove("mapManage_currentMap_" + mapUid);
            }
            UI::EndDisabled();

#else
            UI::Text("Install plugin MapInfo to manage maps.");
#endif
            if (inTabBar) UI::EndTabItem();
        }

        void RenderPlayerManageNewPlayer(Domain::Player@ existingPlayer, Domain::Player@ currentPlayer) {
            if (existingPlayer !is null) return;
            
            if (!PlayerForm("playerManage_currentPlayer", currentPlayer, Services::PlayerSubmitting)) {
                UI::Text("No current player found.");
                return;
            }
            
            // TODO: creating a player with your accountId doesnt really make sense as you should already have a player
            // to even have player manage permission. this should be changed to support creating a player
            // with a different accountId
            UI::BeginDisabled(Services::PlayerSubmitting);
            if (UI::Button("Submit" + (Services::PlayerSubmitting ? "ing.." : "") + " New Player")) {
                trace("Submitting new player: " + currentPlayer.accountId);
                startnew(Services::SubmitPlayer, currentPlayer);
            }
            UI::EndDisabled();
        }

        void RenderPlayerManageExistingPlayerNoCurrent(Domain::Player@ existingPlayer, Domain::Player@ currentPlayer) {
            if (existingPlayer is null) return;
            if (currentPlayer !is null) return;

            if (!PlayerForm("playerManage_existingPlayer", existingPlayer, Services::PlayerSubmitting)) return;
            
            UI::BeginDisabled(Services::PlayerSubmitting);
            if (UI::Button("Updat" + (Services::PlayerSubmitting ? "ing.." : "e") + " Player")) {
                trace("Updating player no current: " + existingPlayer.accountId);
                startnew(Services::SubmitPlayer, existingPlayer);
            }
            UI::EndDisabled();
        }

        void RenderPlayerManageExistingPlayer(Domain::Player@ existingPlayer, Domain::Player@ currentPlayer) {
            if (existingPlayer is null) return;
            if (currentPlayer is null) return;
            
            // TODO: Add support for admin to submit player information for other players.
            if (currentPlayer.accountId != existingPlayer.accountId) {
                UI::Text("Current player does not match your player.");

                UI::BeginDisabled();
                UI::InputText(Label("Current Account Id", "medalTimeManage_existingPlayer", "accountId"), existingPlayer.accountId);
                UI::InputText(Label("Your Account Id", "medalTimeManage_currentPlayer", "accountId"), currentPlayer.accountId);
                UI::EndDisabled();

                UI::NewLine();

                return;
            }
            
            if (!PlayerForm("playerManage_existingPlayer", existingPlayer, true, true, false)) return;
            UI::Separator();
            if (!PlayerForm("playerManage_currentPlayer", currentPlayer, Services::PlayerSubmitting, false, true)) return;

            UI::BeginDisabled(Services::PlayerSubmitting);
            if (UI::Button("Updat" + (Services::PlayerSubmitting ? "ing.." : "e") + " Player")) {
                trace("Updating player: " + existingPlayer.accountId);
                startnew(Services::SubmitPlayer, currentPlayer);
            }
            UI::EndDisabled();
        }

        void RenderPlayerManage(bool inTabBar = true) {
            if (!Services::Me.HasPermission(Domain::Permission::PlayerManage)) return;
            if (inTabBar && !UI::BeginTabItem("Player##manager-tab-bar")) return;
            else if (!inTabBar && !UI::CollapsingHeader("Player")) return;

            Domain::Player@ existingPlayer = cast<Domain::Player@>(Services::Copy.Get("playerManage_existingPlayer", Services::CurrentPlayer.player));
            Domain::Player@ currentPlayer = cast<Domain::Player@>(Services::Copy.Get("playerManage_currentPlayer", Services::Game::GetActivePlayer()));

            RenderPlayerManageNewPlayer(existingPlayer, currentPlayer);
            RenderPlayerManageExistingPlayerNoCurrent(existingPlayer, currentPlayer);
            RenderPlayerManageExistingPlayer(existingPlayer, currentPlayer);

            UI::SameLine();
            UI::BeginDisabled(Services::PlayerSubmitting);
            if (UI::Button("Reset")) {
                trace("Resetting local cache player..");
                Services::Copy.Remove("playerManage_existingPlayer");
                Services::Copy.Remove("playerManage_currentPlayer");
            }
            UI::EndDisabled();

            if (inTabBar) UI::EndTabItem();
        }

        void RenderMedalTimeManageNewMedalTime(Domain::MedalTime@ existingMedalTime, Domain::MedalTime@ currentMedalTime) {
            if (existingMedalTime !is null) return;
            
            if (!MedalTimeForm("medalTimeManage_currentMedalTime", currentMedalTime, Services::MedalTimeSubmitting)) {
                UI::Text("No current medal time found.");
                return;
            }

            UI::BeginDisabled(Services::MedalTimeSubmitting || (currentMedalTime.medalTime < 0 || currentMedalTime.medalTime > 2147483647) && currentMedalTime.customMedalTime == -1);
            if (UI::Button("Submit" + (Services::MedalTimeSubmitting ? "ing.." : "") + " New Medal Time")) {
                trace("Submitting new Medal Time: " + currentMedalTime.mapUid + "_" + currentMedalTime.accountId);
                startnew(Services::SubmitMedalTime, currentMedalTime);
            }
            UI::EndDisabled();
        }

        void RenderMedalTimeManageExistingMedalTimeNoCurrent(Domain::MedalTime@ existingMedalTime, Domain::MedalTime@ currentMedalTime) {
            if (existingMedalTime is null) return;
            if (currentMedalTime !is null) return;

            if (!MedalTimeForm("medalTimeManage_existingMedalTime", existingMedalTime, Services::MedalTimeSubmitting)) return;
            
            UI::BeginDisabled(Services::MedalTimeSubmitting);
            if (UI::Button("Updat" + (Services::MedalTimeSubmitting ? "ing.." : "e") + " Medal Time")) {
                trace("Updating Medal Time no current: " + existingMedalTime.mapUid + "_" + existingMedalTime.accountId);
                startnew(Services::SubmitMedalTime, existingMedalTime);
            }
            UI::EndDisabled();
        }

        void RenderMedalTimeManageExistingMedalTime(Domain::MedalTime@ existingMedalTime, Domain::MedalTime@ currentMedalTime) {
            if (existingMedalTime is null) return;
            if (currentMedalTime is null) return;
            if (currentMedalTime.accountId != existingMedalTime.accountId) return;
            
            if (!MedalTimeForm("medalTimeManage_existingMedalTime", existingMedalTime, true, true, false)) return;
            UI::Separator();
            
            UI::BeginDisabled();
            UI::InputInt(Label("PB", "medalTimeManage_currentMedalTime", "medalTimePB"), currentMedalTime.medalTime);
            UI::EndDisabled();
            if (!MedalTimeForm("medalTimeManage_currentMedalTime", currentMedalTime, Services::MedalTimeSubmitting, false, true)) return;

            UI::BeginDisabled(Services::MedalTimeSubmitting || ((currentMedalTime.medalTime < 0 || currentMedalTime.medalTime > 2147483647) && currentMedalTime.customMedalTime == -1));
            if (UI::Button("Updat" + (Services::MedalTimeSubmitting ? "ing.." : "e") + " MedalTime")) {
                trace("Updating MedalTime: " + existingMedalTime.mapUid + "_" + existingMedalTime.accountId);
                startnew(Services::SubmitMedalTime, currentMedalTime);
            }
            UI::EndDisabled();
        }

        void RenderMedalTimeManage(const string&in mapUid, bool inTabBar = true) {
            if (!Services::Me.HasPermission(Domain::Permission::MedalTimesManage)) return;
            if (inTabBar && !UI::BeginTabItem("Medal Time##manager-tab-bar")) return;
            else if (!inTabBar && !UI::CollapsingHeader("Medal Time")) return;

            // TODO: add support for submitting the map from here if you also have map manage permission
            Domain::Map@ existingMap = Services::Maps.GetMap(mapUid);
            if (existingMap is null) {
                UI::Text("Map does not support medal times.");

                UI::BeginDisabled();
                UI::InputText(Label("Map Uid", "medalTimeManage_existingMap", "mapUid"), mapUid);
                UI::EndDisabled();

                if (inTabBar) UI::EndTabItem();
                return;
            }

            // TODO: add support for player to submit from here? is that needed? you need an api
            // key to submit medals at all, so you should always have a player ... right?
            auto accountId = Services::CurrentPlayer.accountId;
            Domain::Player@ existingPlayer = Services::CurrentPlayer.player;
            if (existingPlayer is null) {
                UI::Text("Current player does not support medal times.");

                UI::BeginDisabled();
                UI::InputText(Label("Account Id", "medalTimeManage_existingPlayer", "accountId"), accountId);
                UI::EndDisabled();

                if (inTabBar) UI::EndTabItem();
                return;
            }

            // TODO: Add support for admin to submit medal times for other players.
            Domain::Player@ currentPlayer = Services::Game::GetActivePlayer();
            if (currentPlayer is null || existingPlayer.accountId != currentPlayer.accountId) {
                UI::Text("Current player does not match your player.");

                UI::BeginDisabled();
                UI::InputText(Label("Current Account Id", "medalTimeManage_existingPlayer", "accountId"), existingPlayer.accountId);
                UI::InputText(Label("Your Account Id", "medalTimeManage_currentPlayer", "accountId"), currentPlayer.accountId);
                UI::EndDisabled();

                if (inTabBar) UI::EndTabItem();
                return;
            }

            Domain::MedalTime@ existingMedalTime = cast<Domain::MedalTime@>(Services::Copy.Get("medalTimeManage_existingMedalTime_" + existingMap.mapUid + "_" + existingPlayer.accountId, Services::CurrentPlayer.GetMedalTime(existingMap.mapUid)));
            Domain::MedalTime@ currentMedalTime = cast<Domain::MedalTime@>(Services::Copy.Get("medalTimeManage_currentMedalTime_" + existingMap.mapUid + "_" + existingPlayer.accountId, Services::Game::GetActivePlayerMedalTime()));

            RenderMedalTimeManageNewMedalTime(existingMedalTime, currentMedalTime);
            RenderMedalTimeManageExistingMedalTimeNoCurrent(existingMedalTime, currentMedalTime);
            RenderMedalTimeManageExistingMedalTime(existingMedalTime, currentMedalTime);

            UI::SameLine();
            UI::BeginDisabled(Services::MedalTimeSubmitting);
            if (UI::Button("Reset")) {
                trace("Resetting local cache medal times: " + existingMap.mapUid + "_" + existingPlayer.accountId);
                Services::Copy.Remove("medalTimeManage_existingMedalTime_" + existingMap.mapUid + "_" + existingPlayer.accountId);
                Services::Copy.Remove("medalTimeManage_currentMedalTime_" + existingMap.mapUid + "_" + existingPlayer.accountId);
            }
            UI::EndDisabled();

            if (inTabBar) UI::EndTabItem();
        }
    }
}
