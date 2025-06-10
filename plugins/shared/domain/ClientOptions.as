namespace Domain {
    interface IClientOptions {
        string get_baseUrl();
        void set_baseUrl(const string&in baseUrl);

        string get_apikey();
        void set_apikey(const string&in apikey);

        bool get_debug();
        void set_debug(bool debug);

        uint64 get_latency();
        void set_latency(uint64 latency);

        void Reset();
    }
}