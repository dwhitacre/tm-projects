namespace Services {
    bool Loading = true; 

    SettingsService@ Settings = SettingsService();
    ConfigService@ Config = ConfigService(Settings.options);
    ReadyService@ Ready = ReadyService(Settings.options, Config);
    CopyService@ Copy = CopyService();

    void LoadServices() {
        Loading = true;
        trace("Loading services..");

        Copy.Clear();
        Config.Fetch();

        trace("Services loaded.");
        Loading = false;
    }

    void StartReadyHealthCheck() {
        Ready.HealthCheck();    
    }

    void Reset() {
        Copy.Clear();
        Config.Clear();

        LoadServices();
    }
}