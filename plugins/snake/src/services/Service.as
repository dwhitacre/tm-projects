namespace Services {
    bool Loading = true; 

    class Service {
        Service() {}
    }

    SettingsService@ Settings = SettingsService();
    FontsService@ Fonts = FontsService();
    ReadyService@ Ready = ReadyService();
    MeService@ Me = MeService();
    ConfigService@ Config = ConfigService();
    PlayersService@ Players = PlayersService();
    CopyService@ Copy = CopyService();

    void LoadServices() {
        Loading = true;
        trace("Loading services..");

        Copy.Clear();
        Config.Fetch();
        Me.Fetch();
        Players.FetchPlayers();

        trace("Services loaded.");
        Loading = false;
    }

    void StartReadyHealthCheck() {
        Ready.HealthCheck();    
    }

    void Reset() {
        Copy.Clear();
        Players.Clear();
        Me.Clear();
        Config.Clear();

        LoadServices();
    }
}