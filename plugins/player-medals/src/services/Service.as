namespace Services {
    bool Loading = true; 
    bool PBsLoading = true;

    SettingsService@ Settings = SettingsService();
    IconsService@ Icons = IconsService();
    ConfigService@ Config = ConfigService(Settings.options);
    ReadyService@ Ready = ReadyService(Settings.options, Config);
    MeService@ Me = MeService();
    MapsService@ Maps = MapsService();
    PlayersService@ Players = PlayersService();
    MedalTimesService@ MedalTimes = MedalTimesService();
    PBsService@ PBs = PBsService();
    CurrentPlayerService@ CurrentPlayer = CurrentPlayerService();
    CopyService@ Copy = CopyService();

    void LoadServices() {
        Loading = true;
        trace("Loading services..");

        Copy.Clear();
        Config.Fetch();
        Me.Fetch();
        Maps.FetchMaps();
        Players.FetchPlayers();
        CurrentPlayer.FetchMedalTimes();
        startnew(StartPBFetch);

        trace("Services loaded.");
        Loading = false;
    }

    void StartReadyHealthCheck() {
        Ready.HealthCheck();    
    }

    void StartPBFetch() {
        PBsLoading = true;

        auto mapUids = Maps.GetMapUids();
        array<string> requestMapUids = {};
        for (uint i = 0; i < mapUids.Length; i++) {
            requestMapUids.InsertLast(mapUids[i]);
            if (requestMapUids.Length >= 25) {
                PBs.FetchPBs(requestMapUids);
                requestMapUids.RemoveRange(0, requestMapUids.Length);
            }
        }
        if (requestMapUids.Length > 0) PBs.FetchPBs(requestMapUids);

        PBsLoading = false;
    }

    void StartPBLoop() {
        Game::ActivePlayerPBLoop();
    }

    void Reset() {
        Icons.Clear();
        Copy.Clear();
        CurrentPlayer.Clear();
        PBs.Clear();
        MedalTimes.Clear();
        Maps.Clear();
        Players.Clear();
        Me.Clear();
        Config.Clear();

        LoadServices();
    }
}