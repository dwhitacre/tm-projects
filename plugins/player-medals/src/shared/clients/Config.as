namespace Clients {
    class ConfigClient : Client {
        ConfigClient(Domain::IClientOptions@ options) {
            super(options);
        }

        Domain::Config@ Fetch() {
            auto response = this.HttpGet("config");
            if (!response.HasKey("config")) return null;

            return Domain::ConfigFromJson(response["config"]);
        }
    }
}
