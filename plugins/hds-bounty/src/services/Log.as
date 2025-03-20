void LogTrace(const string &in msg) {
    if (S_Advanced_DevLog) {
        array<string> msgs = msg.Split("\n");
        for (uint i = 0; i < msgs.Length; i++) {
            trace(msgs[i]);
        }
    }
}

void LogInfo(const string &in msg) {
    trace(msg);
}

void LogWarning(const string &in msg) {
    warn(msg);
}

void LogError(const string &in msg) {
    error(msg);
}
