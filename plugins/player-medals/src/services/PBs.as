namespace Services {
    class PBsService : Service {
        Domain::Cache@ pbsCache = Domain::Cache();
        Clients::NadeoClient@ client;

        PBsService() {
            super();
            @client = Clients::NadeoClient(Settings.options);
        }

        Domain::PB@ GetPB(const string&in mapUid) {
            if (!pbsCache.Exists(mapUid)) return null;
            return cast<Domain::PB@>(pbsCache.Get(mapUid));
        }

        array<Domain::Domain@>@ GetPBs() {
            return pbsCache.GetAll();
        }

        void UpdateCachePB(const string&in mapUid, Domain::PB@ pb) {
            pbsCache.Set(mapUid, @pb);
        }

        void FetchPB(const string&in mapUid) {
            auto pbs = client.FetchPBs({ mapUid });
            if (pbs.Length < 1) return;
            pbsCache.Set(pbs[0].mapUid, @pbs[0]);
        }

        void FetchPBs(array<string>@ mapUids = {}) {
            if (mapUids.Length < 1) return;

            auto pbs = client.FetchPBs(mapUids);
            if (pbs.Length < 1) return;

            for (uint i = 0; i < pbs.Length; i++) {
                pbsCache.Set(pbs[i].mapUid, @pbs[i]);
            }
        }

        void Clear() {
            pbsCache.Clear();
        }
    }
}
