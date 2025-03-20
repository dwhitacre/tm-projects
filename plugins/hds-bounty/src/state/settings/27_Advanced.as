[Setting category="Advanced" name="State Update Enabled" description="If disabled, automatic refresh of state will not occur. There is no manual refresh at this time."]
bool S_Advanced_StateUpdateEnabled = true;

[Setting category="Advanced" name="State Update delay (ms)" description="Time in milliseconds for the plugin to wait between checking for updates in state. Lowering this may adversely affect performance."]
int S_Advanced_StateUpdateDelay = 15000;

[Setting category="Advanced" name="Club Id" description="This is used to lookup player account ids. Probably shouldn't change it."]
string S_Advanced_ClubId = "50092";

[Setting category="Advanced" name="Developer log trace" description="Log way too much info. Only need to enable this when trying to capture logs for reporting issues."]
bool S_Advanced_DevLog = false;

[Setting category="Advanced" name="Openplanet Config Url" description="This is used to sync plugin settings."]
string S_Advanced_OpenplanetConfigUrl = "https://openplanet.dev/plugin/hdsbounty/config";