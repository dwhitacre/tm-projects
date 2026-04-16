namespace Domain {
    class Cache {
        dictionary map = dictionary();
        array<string> sortedKeys = {};

        uint get_Length() {
            return sortedKeys.Length;
        }

        int FindInsertPosition(const string&in key, Domain@ value) {
            int low = 0;
            int high = sortedKeys.Length - 1;

            while (low <= high) {
                int mid = (low + high) / 2;
                if (value.CompareTo(GetByIndex(mid)) < 0) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            return low;
        }

        bool Exists(const string&in key) {
            return map.Exists(key);
        }

        void Set(const string&in key, Domain@ value) {
            if (this.Exists(key)) {
                map.Set(key, @value);
                return;
            }
            
            map.Set(key, @value);
            auto insertPos = FindInsertPosition(key, value);
            sortedKeys.InsertAt(insertPos, key);
        }

        void Remove(const string&in key) {
            if (!this.Exists(key)) {
                return;
            }

            map.Delete(key);
            int index = sortedKeys.Find(key);
            if (index != -1) {
                sortedKeys.RemoveAt(index);
            }
        }

        Domain@ Get(const string&in key) {
            if (!this.Exists(key)) return null;
            return cast<Domain@>(map[key]);
        }

        Domain@ GetByIndex(uint index) {
            if (index >= sortedKeys.Length) {
                return null;
            }
            return Get(sortedKeys[index]);
        }

        array<string>@ GetKeys() {
            return sortedKeys;
        }

        array<Domain@>@ GetAll() {
            array<Domain@> arr = {};
            for (uint i = 0; i < GetKeys().Length; i++) {
                auto domain = Get(GetKeys()[i]);
                arr.InsertLast(domain);
            }
            return arr;
        }

        void Clear() {
            map.DeleteAll();
            sortedKeys.RemoveRange(0, sortedKeys.Length);
        }

        Cache@ Copy() {
            auto cache = Cache();
            for (uint i = 0; i < sortedKeys.Length; i++) {
                auto key = sortedKeys[i];
                auto value = Get(key);
                cache.Set(key, value.Copy());
            }
            return cache;
        }
    }
}