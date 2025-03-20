namespace Domain {
    class Config : Domain {
        bool healthCheckEnabled = true;
        int64 healthCheckMs = 300000;

        Config() {
            super();
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["healthCheckEnabled"] = this.healthCheckEnabled;
            json["healthCheckMs"] = this.healthCheckMs;
            return json;
        }

        array<string>@ Columns() override {
            return {
                "healthCheckEnabled",
                "healthCheckMs"
            };
        }
    }

    Config@ ConfigFromJson(Json::Value@ json) {
        auto config = Config();
        
        if (json.HasKey("healthCheckEnabled")) config.healthCheckEnabled = bool(json["healthCheckEnabled"]);
        if (json.HasKey("healthCheckMs")) config.healthCheckMs = int64(json["healthCheckMs"]);

        return config;
    }
}