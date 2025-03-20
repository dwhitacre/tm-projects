namespace Services {
    class ReadyService : Service {
        bool isHealthCheckRunning = false;
        bool isHealthy = true;
        Clients::ReadyClient@ client;
        
        ReadyService() {
            super();
            @client = Clients::ReadyClient(Settings.options);
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

                if (Config.Get() is null || !Config.Get().healthCheckEnabled) continue;
                 
                if (!IsReady()) {
                    isHealthy = false;
                    warn("Healthcheck failed. API may not be accessible. Retrying in " + Config.Get().healthCheckMs + "ms..");
                } else {
                    isHealthy = true;
                }
                sleep(Config.Get().healthCheckMs);
            }
        }
    }
}

