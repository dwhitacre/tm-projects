namespace Services {
    class ReadyService : Service {
        bool isHealthCheckRunning = false;
        bool isHealthy = true;
        Clients::ReadyClient@ client;
        Services::ConfigService@ config;
        
        ReadyService(Domain::IClientOptions@ options, Services::ConfigService@ config) {
            super();
            @client = Clients::ReadyClient(options);
            @this.config = config;
        }

        bool get_IsHealthy() {
            return isHealthy;
        }

        bool IsReady() {
            return client.Fetch();
        }

        void HealthCheck() {
            if (isHealthCheckRunning) return;
            isHealthCheckRunning = true;

            while (true) {
                yield();

                if (config is null) continue;
                if (config.Get() is null || !config.Get().healthCheckEnabled) continue;
                 
                if (!IsReady()) {
                    isHealthy = false;
                    warn("Healthcheck failed. API may not be accessible. Retrying in " + config.Get().healthCheckMs + "ms..");
                } else {
                    isHealthy = true;
                }
                sleep(config.Get().healthCheckMs);
            }
        }
    }
}

