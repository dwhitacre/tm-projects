class Cache {
    Cache() {}
    dictionary c = {};
    
    string call(const string &in key) {
        throw('Cache implementations need to override call');
        return "";
    }

    array<string> callMany(array<string>@ keys) {
        throw('Cache implementations need to override callMany');
        return {};
    }
    
    string Get(const string &in key) {
        string value = "";
        if (c.Exists(key)) c.Get(key, value);
        if (value.Length <= 0) {
            value = call(key);
            c.Set(key, value);
        }
        return value;
    }

    void Init(array<string>@ keys) {
        array<string> values = callMany(keys);
        if (values.Length != keys.Length) throw('Cache implementations callMany needs to return same amount of values as keys');

        for (uint i = 0; i < values.Length; i++) {
            c.Set(keys[i], values[i]);
        }
    }

    void Clear() {
        c.DeleteAll();
    }
}