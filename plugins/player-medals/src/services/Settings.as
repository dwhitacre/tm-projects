namespace Services {
    class SettingsService : Service {
        Domain::ClientOptions@ options = Domain::ClientOptions();
        Domain::Colors@ colors = Domain::Colors();
        Domain::MainWindow@ mainWindow = Domain::MainWindow();
        Domain::MedalWindow@ medalWindow = Domain::MedalWindow();
        Domain::UIMedals@ uiMedals = Domain::UIMedals();
        
        SettingsService() {
            super();
        }
    }
}

