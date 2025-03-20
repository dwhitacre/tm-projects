[Setting hidden] bool S_MainWindow = false;
[Setting hidden] bool S_MainWindowAutoResize = false;
[Setting hidden] bool S_MainWindowHideWithGame = true;
[Setting hidden] bool S_MainWindowHideWithOP = true;

namespace Domain {
    class MainWindow {
        bool get_enabled() {
            return S_MainWindow;
        }
        void set_enabled(bool enabled) {
            S_MainWindow = enabled;
        }

        bool get_autoResize() {
            return S_MainWindowAutoResize;
        }
        void set_autoResize(bool autoResize) {
            S_MainWindowAutoResize = autoResize;
        }

        bool get_showWithGame() {
            return !S_MainWindowHideWithGame;
        }
        void set_showWithGame(bool showWithGame) {
            S_MainWindowHideWithGame = !showWithGame;
        }

        bool get_showWithOpenplanet() {
            return !S_MainWindowHideWithOP;
        }
        void set_showWithOpenplanet(bool showWithOpenplanet) {
            S_MainWindowHideWithOP = !showWithOpenplanet;
        }

        MainWindow() {}

        void Reset() {
            this.enabled = false;
            this.autoResize = false;
            this.showWithGame = false;
            this.showWithOpenplanet = false;
        }
    }
}