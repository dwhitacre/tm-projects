[Setting hidden] string S_ApiUrl = "https://openplanet-snake.danonthemoon.dev/api";
[Setting hidden] string S_ApiKey = "";
[Setting hidden] bool S_ApiDebug = false;
[Setting hidden] uint64 S_ApiLatency = 0;

namespace Domain {
    class ClientOptions {
        string get_baseUrl() {
            return S_ApiUrl;
        }
        void set_baseUrl(const string&in baseUrl) {
            S_ApiUrl = baseUrl;
        }

        string get_apikey() {
            return S_ApiKey;
        }
        void set_apikey(const string&in apikey) {
            S_ApiKey = apikey;
        }

        bool get_debug() {
            return S_ApiDebug;
        }
        void set_debug(bool debug) {
            S_ApiDebug = debug;
        }

        uint64 get_latency() {
            return S_ApiLatency;
        }
        void set_latency(uint64 latency) {
            S_ApiLatency = latency;
        }

        ClientOptions() {}

        void Reset() {
            this.baseUrl = "https://openplanet-snake.danonthemoon.dev/api";
            this.apikey = "";
            this.debug = true;
            this.latency = 0;
        }
    }
}