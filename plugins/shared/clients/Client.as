namespace Clients {
    class Client {
        Domain::ClientOptions@ options;

        string audienceLive = "NadeoLiveServices";
        string get_nadeoUrlLive() { return NadeoServices::BaseURLLive(); }

        string pluginName = "";
        string pluginVersion = "";
        string loggedInUser = "";

        Client(Domain::ClientOptions@ options) {
            @this.options = options;
            this.pluginName = Meta::ExecutingPlugin().Name.ToLower().Replace(" ", "-");
            this.pluginVersion = Meta::ExecutingPlugin().Version;
            this.loggedInUser = GetLocalLogin();
        }

        string Url(const string&in path) {
            auto trimmedBaseUrl = options.baseUrl.EndsWith("/") ? options.baseUrl.SubStr(0, options.baseUrl.Length - 1) : options.baseUrl;
            auto url = trimmedBaseUrl + (path.StartsWith("/") ? path : '/' + path);
            url += url.Contains("?") ? "&" : "?";
            url += "source=" + this.pluginName + ":plugin:" + this.pluginVersion + ":" + this.loggedInUser;
            if (options.apikey != "") {
                url += "&api-key=" + options.apikey;
            }
            return url;
        }

        string NadeoUrl(const string&in path, const string&in audience) {
            if (audience == audienceLive) return this.nadeoUrlLive + (path.StartsWith("/") ? path : '/' + path);
            return "";
        }

        Json::Value@ HandleResponse(Net::HttpRequest@ req, const string&in path, uint64 start, Json::Value@ request = null, const string&in audience = "") {
            while (!req.Finished())
                yield();

            if (options.latency > 0) {
                const uint64 latencyEnd = Time::Now + options.latency;
                while (Time::Now < latencyEnd)
                    yield();
            }

            Json::Value data = Json::Object();
            data["totalMs"] = Time::Now - start;
            data["path"] = path;
            data["baseUrl"] = options.baseUrl;
            data["hasApiKey"] = options.apikey != "";
            data["response"] = req.Json();
            if (request !is null) data["request"] = request;
            if (audience != "") data["audience"] = audience;

            if (req.ResponseCode() != 200) {
                error("Error making GET request.");
                error(Json::Write(data));
                return Json::Object();
            }

            if (options.debug) trace(Json::Write(data));
            return data["response"];
        }

        Json::Value@ HttpGet(const string&in path) {
            const uint64 start = Time::Now;

            auto url = this.Url(path);
            auto req = Net::HttpGet(url);

            return HandleResponse(req, path, start);
        }

        Json::Value@ HttpPost(const string&in path, Json::Value@ json) {
            const uint64 start = Time::Now;

            auto url = this.Url(path);
            auto req = Net::HttpPost(url, Json::Write(json), "application/json");

            return HandleResponse(req, path, start, json);
        }

        Json::Value@ NadeoPost(const string &in path, const string &in audience, Json::Value@ json) {
            const uint64 start = Time::Now;
            
            auto url = this.NadeoUrl(path, audience);
            if (url == "") return null;

            NadeoServices::AddAudience(audience);
            while (!NadeoServices::IsAuthenticated(audience))
                yield();

            auto req = NadeoServices::Post(audience, url, Json::Write(json));
            req.Start();
            
            return HandleResponse(req, path, start, json, audience);
        }

        Json::Value@ NadeoLivePost(const string &in path, Json::Value@ json) {
            return NadeoPost(path, audienceLive, json);
        }
    }
}