string ParseStringSetting(const string &in setting) {
    auto str = setting.Trim();
    if (str.Length <= 0) throw("setting cannot be empty string");
    return str;
}

array<string> ParseStringArraySetting(const string &in setting, const string &in delim = "\n") {
    auto values = setting.Split(delim);
    for (uint i = 0; i < values.Length; i++) {
        values[i] = ParseStringSetting(values[i]);
    }
    return values;
}

string KeyValuesToString(array<array<string>@>@ keyvalues) {
    string ret = "{\n";

    for (uint i = 0; i < keyvalues.Length; i++) {
        if (keyvalues[i].Length != 2) throw("keyvalues should be tuples");
        ret += "  ";
        ret += keyvalues[i][0];
        ret += ": ";
        ret += keyvalues[i][1];
        ret += ",\n";
    }

    ret += "}";
    return ret;
}

string ArrayToString(array<string>@ arr) {
    string ret = "{\n";

    for (uint i = 0; i < arr.Length; i++) {
        ret += "  ";
        ret += arr[i];
        ret += ",\n";
    }

    ret += "}";
    return ret;
}