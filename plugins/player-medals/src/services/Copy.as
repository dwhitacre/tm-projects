namespace Services {
    class CopyService : Service {
        dictionary@ copyCache = dictionary();

        CopyService() {
            super();
        }

        Domain::Domain@ Get(const string&in id, Domain::Domain@ original) {
            if (copyCache.Exists(id)) {
                return cast<Domain::Domain@>(copyCache[id]);
            }

            if (original is null) return null;

            auto copy = original.Copy();
            if (copy is null) return null;

            copyCache.Set(id, @copy);
            return cast<Domain::Domain@>(copyCache[id]);
        }

        void Remove(const string&in id) {
            if (copyCache.Exists(id)) {
                copyCache.Delete(id);
            }
        }

        void Clear() {
            copyCache.DeleteAll();
        }
    }
}
