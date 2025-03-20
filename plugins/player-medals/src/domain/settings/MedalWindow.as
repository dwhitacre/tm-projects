[Setting hidden] bool S_MedalWindow = true;
[Setting hidden] bool S_MedalWindowShowManage = false;
[Setting hidden] bool S_MedalWindowHideManageWithOP = true;
[Setting hidden] bool S_MedalWindowShowManageTabs = true;
[Setting hidden] bool S_MedalWindowShowManageMap = true;
[Setting hidden] bool S_MedalWindowShowManagePlayer = true;
[Setting hidden] bool S_MedalWindowShowManageMedalTime = true;
[Setting hidden] bool S_MedalWindowDelta = true;
[Setting hidden] bool S_MedalWindowHideWithGame = true;
[Setting hidden] bool S_MedalWindowHideWithOP = false;

namespace Domain {
    class MedalWindow {
        bool get_enabled() {
            return S_MedalWindow;
        }
        void set_enabled(bool enabled) {
            S_MedalWindow = enabled;
        }

        bool get_delta() {
            return S_MedalWindowDelta;
        }
        void set_delta(bool delta) {
            S_MedalWindowDelta = delta;
        }

        bool get_showManage() {
            return S_MedalWindowShowManage;
        }
        void set_showManage(bool showManage) {
            S_MedalWindowShowManage = showManage;
        }

        bool get_showManageWithOpenplanet() {
            return !S_MedalWindowHideManageWithOP;
        }
        void set_showManageWithOpenplanet(bool showManageWithOpenplanet) {
            S_MedalWindowHideManageWithOP = !showManageWithOpenplanet;
        }

        bool get_showManageTabs() {
            return S_MedalWindowShowManageTabs;
        }
        void set_showManageTabs(bool showManageTabs) {
            S_MedalWindowShowManageTabs = showManageTabs;
        }

        bool get_showManageMap() {
            return S_MedalWindowShowManageMap;
        }
        void set_showManageMap(bool showManageMap) {
            S_MedalWindowShowManageMap = showManageMap;
        }

        bool get_showManagePlayer() {
            return S_MedalWindowShowManagePlayer;
        }
        void set_showManagePlayer(bool showManagePlayer) {
            S_MedalWindowShowManagePlayer = showManagePlayer;
        }

        bool get_showManageMedalTime() {
            return S_MedalWindowShowManageMedalTime;
        }
        void set_showManageMedalTime(bool showManageMedalTime) {
            S_MedalWindowShowManageMedalTime = showManageMedalTime;
        }

        bool get_showWithGame() {
            return !S_MedalWindowHideWithGame;
        }
        void set_showWithGame(bool showWithGame) {
            S_MedalWindowHideWithGame = !showWithGame;
        }

        bool get_showWithOpenplanet() {
            return !S_MedalWindowHideWithOP;
        }
        void set_showWithOpenplanet(bool showWithOpenplanet) {
            S_MedalWindowHideWithOP = !showWithOpenplanet;
        }

        MedalWindow() {}

        void Reset() {
            this.enabled = true;
            this.delta = true;
            this.showManage = false;
            this.showManageWithOpenplanet = false;
            this.showManageTabs = true;
            this.showManageMap = true;
            this.showManagePlayer = true;
            this.showManageMedalTime = true;
            this.showWithGame = false;
            this.showWithOpenplanet = true;
        }
    }
}