namespace MapMgr {
    class MapCache : Cache {
        string call(const string &in key) override {
            LogTrace("Getting map id for uid: " + key);
            return Api::GetMapId(key);
        }
    }

    class MapNameCache : Cache {
        string call(const string &in key) override {
            LogTrace("Getting map name for uid: " + key);
            return Api::GetMapName(key);
        }
    }

    MapCache cache = MapCache();
    MapNameCache nameCache = MapNameCache();

    string GetMapId(const string &in mapUid) {
        return cache.Get(mapUid);
    }

    string GetMapName(const string &in mapUid) {
        return nameCache.Get(mapUid);
    }
}