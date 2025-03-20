namespace Services {
    bool MapSubmitting = false;

    class MapsService : Service {
        Domain::Cache@ mapsCache = Domain::Cache();
        Domain::Cache@ campaignsCache = Domain::Cache();

        // TODO: updating an existing map such that it moves to a new campaign
        // will not remove the map from the old campaign. resetting the cache
        // in the plugin manually fixes the state for the user
        void addMapToCache(Domain::Map@ map) {
            if (map is null) return;

            auto campaign = Domain::CampaignFromMap(map);
            if (campaignsCache.Exists(campaign.name)) {
                @campaign = cast<Domain::Campaign@>(campaignsCache.Get(campaign.name));
            }

            (@campaign).maps.Set(map.mapUid, @map);
            mapsCache.Set(map.mapUid, @map);
            campaignsCache.Set(campaign.name, @campaign);
        }

        Clients::MapsClient@ client;

        MapsService() {
            super();
            @client = Clients::MapsClient(Settings.options);
        }

        Domain::Map@ GetMap(const string&in mapUid) {
            if (!mapsCache.Exists(mapUid)) return null;
            return cast<Domain::Map@>(mapsCache.Get(mapUid));
        }

        array<Domain::Domain@>@ GetMaps() {
            return mapsCache.GetAll();
        }

        array<string>@ GetMapUids() {
            return mapsCache.GetKeys();
        }

        Domain::Campaign@ GetCampaign(const string&in campaign) {
            if (!campaignsCache.Exists(campaign)) return null;
            return cast<Domain::Campaign@>(campaignsCache.Get(campaign));
        }

        array<Domain::Domain@>@ GetCampaigns() {
            return campaignsCache.GetAll();
        }

        void FetchMap(const string&in mapUid) {
            auto map = client.FetchMap(mapUid);
            addMapToCache(map);
        }

        void FetchCampaign(const string&in campaignName) {
            auto maps = client.FetchCampaign(campaignName);
            if (maps is null) return;
            if (maps.Length < 1) return;

            for (uint i = 0; i < maps.Length; i++) {
                addMapToCache(maps[i]);
            }
        }

        void FetchMaps() {
            auto maps = client.FetchMaps();
            if (maps is null) return;
            if (maps.Length < 1) return;

            for (uint i = 0; i < maps.Length; i++) {
                addMapToCache(maps[i]);
            }
        }

        void UpsertMap(Domain::Map@ map) {
            if (!Me.HasPermission(Domain::Permission::MapManage)) {
                warn("You dont have permission to UpsertMap.");
                return;
            }

            client.UpsertMap(map);
            FetchMap(map.mapUid);
        }

        void Clear() {
            mapsCache.Clear();
            campaignsCache.Clear();
        }
    }

    void SubmitMap(ref@ mapRef) {
        if (mapRef is null) {
            warn("Map is null.");
            return;
        }

        auto map = cast<Domain::Map@>(mapRef);
        MapSubmitting = true;
        Maps.UpsertMap(map);

        // TODO: clearing the copy service caches shouldnt really be done
        // from here as the keys are tracked in view. but since its a coroutine
        // we cant clear it properly from the view atm.
        Services::Copy.Remove("mapManage_existingMap_" + map.mapUid);
        Services::Copy.Remove("mapManage_currentMap_" + map.mapUid);

        MapSubmitting = false;
        trace("Map submitted.");
    }
}
