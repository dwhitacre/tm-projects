namespace Services {
    bool MedalTimeSubmitting = false;

    class MedalTimesService : Service {
        dictionary@ medalTimesCache = dictionary();
        Clients::MedalTimesClient@ client;

        void addMedalTimeToCache(Domain::MedalTime@ medalTime) {
            if (medalTime is null) return;

            if (!medalTimesCache.Exists(medalTime.accountId)) {
                Domain::Cache@ medalTimesMapCache = Domain::Cache();
                medalTimesCache.Set(medalTime.accountId, @medalTimesMapCache);
            }

            auto medalTimesMapCache = cast<Domain::Cache@>(medalTimesCache[medalTime.accountId]);
            medalTimesMapCache.Set(medalTime.mapUid, @medalTime);
        }

        MedalTimesService() {
            super();
            @client = Clients::MedalTimesClient(Settings.options);
        }

        Domain::MedalTime@ GetMedalTime(const string&in accountId, const string&in mapUid) {
            if (!medalTimesCache.Exists(accountId)) return null;
            
            auto medalTimesMapCache = cast<Domain::Cache@>(medalTimesCache[accountId]);
            if (!medalTimesMapCache.Exists(mapUid)) return null;

            return cast<Domain::MedalTime@>(medalTimesMapCache.Get(mapUid));
        }

        array<Domain::Domain@>@ GetMedalTimes(const string&in accountId) {
            if (!medalTimesCache.Exists(accountId)) return null;
            
            auto medalTimesMapCache = cast<Domain::Cache@>(medalTimesCache[accountId]);
            return medalTimesMapCache.GetAll();
        }

        void FetchMedalTime(const string&in accountId, const string&in mapUid) {
            auto medalTime = client.FetchMedalTime(accountId, mapUid);
            addMedalTimeToCache(medalTime);
        }

        void FetchMedalTimes(const string&in accountId) {
            auto medalTimes = client.FetchMedalTimes(accountId);
            if (medalTimes is null) return;
            if (medalTimes.Length < 1) return;

            for (uint i = 0; i < medalTimes.Length; i++) {
                addMedalTimeToCache(medalTimes[i]);
            }
        }

        void UpsertMedalTime(Domain::MedalTime@ medalTime) {
            if (!Me.HasPermission(Domain::Permission::MedalTimesManage)) {
                warn("You dont have permission to UpsertMedalTime.");
                return;
            }

            client.UpsertMedalTime(medalTime);
            FetchMedalTime(medalTime.accountId, medalTime.mapUid);
        }

        void Clear() {
            medalTimesCache.DeleteAll();
        }
    }

    void SubmitMedalTime(ref@ medalTimeRef) {
        if (medalTimeRef is null) {
            warn("MedalTime is null.");
            return;
        }
        
        auto medalTime = cast<Domain::MedalTime@>(medalTimeRef);
        MedalTimeSubmitting = true;
        MedalTimes.UpsertMedalTime(medalTime);

        // TODO: clearing the copy service caches shouldnt really be done
        // from here as the keys are tracked in view. but since its a coroutine
        // we cant clear it properly from the view atm.
        Services::Copy.Remove("medalTimeManage_existingMedalTime_" + medalTime.mapUid + "_" + medalTime.accountId);
        Services::Copy.Remove("medalTimeManage_currentMedalTime_" + medalTime.mapUid + "_" + medalTime.accountId);

        MedalTimeSubmitting = false;
        trace("MedalTime submitted.");
    }
}
