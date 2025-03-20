[Setting hidden] string S_NadeoAccountId = "d2372a08-a8a1-46cb-97fb-23a161d85ad0";
[Setting hidden] string S_NadeoAltAccountId = "aa02b90e-0652-4a1c-b705-4677e2983003";
[Setting hidden] string S_NadeoTonaAccountId = "7cd60a75-609a-4e64-b286-16f329878249";

namespace Services {
    bool MapLoading = false;
    bool PBLoopRunning = false;

    namespace Game {
        bool InMap() {
            CTrackMania@ App = cast<CTrackMania@>(GetApp());

            return App.RootMap !is null
                && App.CurrentPlayground !is null
                && App.Editor is null;
        }

        string GetMapDownloadUrl(const string&in mapUid) {
            CTrackMania@ App = cast<CTrackMania@>(GetApp());
            CTrackManiaMenus@ Menus = cast<CTrackManiaMenus@>(App.MenuManager);
            if (Menus is null) return "";

            CGameManiaAppTitle@ Title = Menus.MenuCustom_CurrentManiaApp;
            if (Title is null) return "";

            if (Title.UserMgr is null
                || Title.UserMgr.Users.Length == 0
                || Title.UserMgr.Users[0] is null
                || Title.DataFileMgr is null
            ) return "";

            CWebServicesTaskResult_NadeoServicesMapScript@ task = Title.DataFileMgr.Map_NadeoServices_GetFromUid(Title.UserMgr.Users[0].Id, mapUid);
            while (task.IsProcessing)
                yield();

            if (task !is null && task.HasSucceeded) {
                CNadeoServicesMap@ Map = task.Map;
                if (Map !is null) return Map.FileUrl;

                if (Title !is null && Title.DataFileMgr !is null)
                    Title.DataFileMgr.TaskResult_Release(task.Id);
            }

            return "";
        }

        Domain::Map@ GetCurrentMap() {
            if (!InMap()) return null;
            CTrackMania@ App = cast<CTrackMania@>(GetApp());

#if DEPENDENCY_MAPINFO
            auto currentMapInfo = MapInfo::GetCurrentMapInfo();
            if (currentMapInfo is null) return null;

            const string mapUid = App.RootMap.EdChallengeId;
            const uint authorTime = App.RootMap.TMObjective_AuthorTime;
            const string name = currentMapInfo.CleanName;
            Domain::Map@ map = null;
            try {
                @map = Domain::Map(mapUid, authorTime, name);
            } catch {
                return null;
            }
            
            map.nadeo = currentMapInfo.AuthorAccountId == S_NadeoAccountId || currentMapInfo.AuthorAccountId == S_NadeoAltAccountId;

            if (currentMapInfo.LoadedWasTOTD && currentMapInfo.TOTDDate.Length > 0) {
                map.totdDate = currentMapInfo.TOTDDate.Split(" ")[0];
            }

            if (name.ToLower().StartsWith("training -")) {
                map.campaign = "Training";
                map.campaignIndex = 0;
            }
            
            return map;       
#else
            return null;
#endif
        }

        Domain::Player@ GetActivePlayer() {
            CTrackMania@ App = cast<CTrackMania@>(GetApp());

            if (App.MenuManager is null
                || App.MenuManager.MenuCustom_CurrentManiaApp is null
                || App.MenuManager.MenuCustom_CurrentManiaApp.LocalUser is null)
                return null;

            const string accountId = App.MenuManager.MenuCustom_CurrentManiaApp.LocalUser.WebServicesUserId;
            const string name = App.MenuManager.MenuCustom_CurrentManiaApp.LocalUser.Name;
            Domain::Player@ player = null;
            try {
                @player = Domain::Player(accountId, name, "3F3");

                if (CurrentPlayer.exists) {
                    player.color = CurrentPlayer.player.color;
                    player.displayName = CurrentPlayer.player.displayName;
                }
            } catch {
                return null;
            }
            return player;
        }

        Domain::PB@ GetActivePlayerPB() {
            if (!InMap()) return null;
            CTrackMania@ App = cast<CTrackMania@>(GetApp());

            if (App.MenuManager is null
                || App.MenuManager.MenuCustom_CurrentManiaApp is null
                || App.MenuManager.MenuCustom_CurrentManiaApp.ScoreMgr is null
                || App.UserManagerScript is null
                || App.UserManagerScript.Users.Length == 0
                || App.UserManagerScript.Users[0] is null)
                return null;

            const string mapUid = App.RootMap.EdChallengeId;
            const uint score = App.MenuManager.MenuCustom_CurrentManiaApp.ScoreMgr.Map_GetRecord_v2(App.UserManagerScript.Users[0].Id, mapUid, "PersonalBest", "", "TimeAttack", "");
            
            Domain::PB@ pb = null;
            try {
                @pb = Domain::PB(mapUid);
            } catch {
                return null;
            }

            pb.score = score;
            return pb;
        }

        void ActivePlayerPBLoop() {
            if (PBLoopRunning) return;
            PBLoopRunning = true;

            while (true) {
                yield();
                
                if (Loading) continue;
                if (PBsLoading) continue;
                if (Config.Get() is null || !Config.Get().pbLoopEnabled) continue;
                if (!InMap()) continue;

                CTrackMania@ App = cast<CTrackMania@>(GetApp());
                if (App.RootMap is null) continue;

                auto mapUid = App.RootMap.EdChallengeId;
                auto pb = PBs.GetPB(mapUid);
                auto activePB = GetActivePlayerPB();
                if (activePB is null) continue;

                if (pb is null || pb.score != activePB.score) {
                    trace("New personal best detected. Fetching..");
                    // TODO: this cache update only needs to be done
                    // because setting a PB with school mode enabled
                    // will not update your remote PB and refetching
                    // will just result in an endless null loop. so dumb.
                    PBs.UpdateCachePB(mapUid, @activePB);

                    // no way to test this without a plugin update. b/c of above
                    PBs.FetchPB(mapUid);
                }

                sleep(Config.Get().pbLoopInterval);
            }
        }

        Domain::MedalTime@ GetActivePlayerMedalTime() {
            auto map = GetCurrentMap();
            auto pb = GetActivePlayerPB();
            auto player = GetActivePlayer();
            if (map is null || pb is null || player is null) return null;

            Domain::MedalTime@ medalTime = null;
            try {
                @medalTime = Domain::MedalTime(map.mapUid, pb.score, player.accountId);

                if (CurrentPlayer.HasMedalTime(map.mapUid)) {
                    auto currentPlayerMedalTime = CurrentPlayer.GetMedalTime(map.mapUid);
                    medalTime.customMedalTime = currentPlayerMedalTime.customMedalTime;
                    medalTime.reason = currentPlayerMedalTime.reason;
                }
            } catch {
                return null;
            }

            return medalTime;
        }

        void PlayMapAsync(const string&in mapUid) {
            MapLoading = true;

            auto downloadUrl = GetMapDownloadUrl(mapUid);
            if (downloadUrl == "") {
                MapLoading = false;
                return;
            }

            ReturnToMenuAsync();

            CTrackMania@ App = cast<CTrackMania@>(GetApp());
            App.ManiaTitleControlScriptAPI.PlayMap(downloadUrl, "TrackMania/TM_PlayMap_Local", "");

            sleep(5000);

            MapLoading = false;
        }

        void ReturnToMenuAsync() {
            CTrackMania@ App = cast<CTrackMania@>(GetApp());

            if (App.Network.PlaygroundClientScriptAPI.IsInGameMenuDisplayed)
                App.Network.PlaygroundInterfaceScriptHandler.CloseInGameMenu(CGameScriptHandlerPlaygroundInterface::EInGameMenuResult::Quit);

            App.BackToMainMenu();

            while (!App.ManiaTitleControlScriptAPI.IsReady)
                yield();
        }
    }
}
