[Setting hidden] bool S_Advanced_DevLog = false;

namespace Services {
    class SettingsService : Service {
        Domain::ClientOptions@ options = Domain::ClientOptions();
        
        SettingsService() {
            super();
        }

        bool get_gameplayDebug() {
            return S_Advanced_DevLog;
        }
        void set_gameplayDebug(bool debug) {
            S_Advanced_DevLog = debug;
        }
    }
}

