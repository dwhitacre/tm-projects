namespace Clients {
    class ReadyClient : Client {
        ReadyClient(Domain::IClientOptions@ options) {
            super(options);
        }

        bool Fetch() {
            auto response = this.HttpGet("ready");
            if (!response.HasKey("status")) return false;
            return response["status"] == 200;
        }
    }
}
