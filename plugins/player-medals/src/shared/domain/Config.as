namespace Domain {
    class Config : Domain {
        bool pbLoopEnabled = false;
        int64 pbLoopInterval = 500;
        bool healthCheckEnabled = true;
        int64 healthCheckMs = 300000;

        Config() {
            super();
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["pbLoopEnabled"] = this.pbLoopEnabled;
            json["pbLoopInterval"] = this.pbLoopInterval;
            json["healthCheckEnabled"] = this.healthCheckEnabled;
            json["healthCheckMs"] = this.healthCheckMs;
            return json;
        }

        array<string>@ Columns() override {
            return {
                "pbLoopEnabled",
                "pbLoopInterval",
                "healthCheckEnabled",
                "healthCheckMs"
            };
        }
    }

    Config@ ConfigFromJson(Json::Value@ json) {
        auto config = Config();
        
        if (json.HasKey("pbLoopEnabled")) config.pbLoopEnabled = bool(json["pbLoopEnabled"]);
        if (json.HasKey("pbLoopInterval")) config.pbLoopInterval = int64(json["pbLoopInterval"]);
        if (json.HasKey("healthCheckEnabled")) config.healthCheckEnabled = bool(json["healthCheckEnabled"]);
        if (json.HasKey("healthCheckMs")) config.healthCheckMs = int64(json["healthCheckMs"]);

        return config;
    }
}