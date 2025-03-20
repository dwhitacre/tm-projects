[Setting category="Birthday" name="Use Mode" description="Use the previous bounty gamemode of Birthday." hidden]
bool S_Birthday_UseMode = true;

[Setting category="Birthday" name="Map Uid" description="The map Uid from trackmania.io for the current bounty"]
string S_Birthday_MapUid = "N1MAyEEtoXNOBguy9PRWOww5Yn1";

[Setting category="Birthday" name="Lock Map Uid" description="This locks the display times to the above map uid. Leaving this unchecked will display the times for the map you are actively playing instead."]
bool S_Birthday_LockMapUid = true;

[Setting category="Birthday" name="Goal Player Account Id" description="The account id of the player to beat."]
string S_Birthday_GoalPlayerAccountId = "e95b40f2-06b5-4094-95bf-92908df224a4";

[Setting category="Birthday" name="Sync Settings" description="This will sync specific settings (eg MapUid, CountdownStartTime, etc) from the openplanet api to ensure they are up to date for an active bounty. Only disable this if you are using the plugin outside of the active bounty."]
bool S_Birthday_SyncSettings = true;
