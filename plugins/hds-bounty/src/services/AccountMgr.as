namespace AccountMgr {
    class AccountIdCache : Cache {
        string call(const string &in key) override {
            LogTrace("Getting account id for player: " + key);
            return Api::GetAccountId(key);
        }

        array<string> callMany(array<string>@ keys) override {
            LogTrace("Getting account id for players:\n" + ArrayToString(keys));
            return Api::GetAccountIds(keys);
        }
    }

    class DisplayNameCache : Cache {
        string call(const string &in key) override {
            LogTrace("Getting display name for accountId: " + key);
            return Api::GetDisplayNames({ key })[0];
        }

        array<string> callMany(array<string>@ keys) override {
            LogTrace("Getting display name for accountIds:\n" + ArrayToString(keys));
            return Api::GetDisplayNames(keys);
        }
    }

    AccountIdCache idCache = AccountIdCache();
    DisplayNameCache nameCache = DisplayNameCache();

    string GetAccountId(const string &in playerName) {
        return idCache.Get(playerName);
    }

    string GetDisplayName(const string &in accountId) {
        return nameCache.Get(accountId);
    }

    void Init(array<string>@ playerNames, array<string>@ accountIds = {}) {
        idCache.Init(playerNames);
        nameCache.Init(accountIds);
    }
}