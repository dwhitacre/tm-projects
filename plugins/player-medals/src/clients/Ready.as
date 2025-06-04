namespace Clients {
    class ReadyClient : Shared::Clients::Client {
        ReadyClient(Domain::ClientOptions@ options) {
            super(options);
        }

        bool Fetch() {
            auto response = this.HttpGet("ready");
            if (!response.HasKey("status")) return false;
            return response["status"] == 200;
        }
    }
}
