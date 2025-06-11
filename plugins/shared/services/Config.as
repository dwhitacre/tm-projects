namespace Services {
    class ConfigService : Service {
        Domain::Config@ config = Domain::Config();
        Clients::ConfigClient@ client;

        ConfigService(Domain::IClientOptions@ options) {
            super();
            @client = Clients::ConfigClient(options);
        }

        Domain::Config@ Get() {
            return config;
        }

        void Fetch() {
            auto configResponse = client.Fetch();
            if (configResponse is null) return;

            @config = configResponse;
        }

        void Clear() {
            @config = null;
        }
    }
}
