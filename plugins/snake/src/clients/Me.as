namespace Clients {
    class MeClient : Client {
        MeClient(Domain::ClientOptions@ options) {
            super(options);
        }

        Domain::Player@ Fetch() {
            auto response = this.HttpGet("me");
            if (!response.HasKey("me")) return null;

            return Domain::PlayerFromJson(response["me"]);
        }
    }
}
