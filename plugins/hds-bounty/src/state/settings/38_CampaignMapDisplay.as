[Setting category="Campaign Map Display" name="Show Leaderboard" description="This display can lag frames. Do not recommend enabling in maps."]
bool S_Campaign_ShowMapLeaderboard = false;

[Setting category="Campaign Map Display" min=1 max=5 name="Number of Records" description="Increasing the number of records seems to linearly cause more laggy frames. Do not recommmend at this time."]
uint S_Campaign_MapNumRecords = 1;

[Setting category="Campaign Map Display" name="Show Header"]
bool S_Campaign_ShowMapHeader = false;

[Setting category="Campaign Map Display" color name="Header Color"]
vec3 S_Campaign_MapHeaderColor = vec3(0.75f, 0.75f, 0.75f);

[Setting category="Campaign Map Display" name="Show Map Name"]
bool S_Campaign_ShowMapName = true;

[Setting category="Campaign Map Display" color name="Map Name Color"]
vec3 S_Campaign_MapNameColor = vec3(0.75f, 0.75f, 0.75f);

[Setting category="Campaign Map Display" color name="Player Position Color"]
vec3 S_Campaign_MapPlayerPositionColor = vec3(1, 1, 1);

[Setting category="Campaign Map Display" color name="Player Name Color"]
vec3 S_Campaign_MapPlayerNameColor = vec3(1, 1, 1);

[Setting category="Campaign Map Display" name="Show Player Zone"]
bool S_Campaign_ShowMapPlayerZone = true;

[Setting category="Campaign Map Display" color name="Player Zone Color"]
vec3 S_Campaign_MapPlayerZoneColor = vec3(1, 1, 1);

[Setting category="Campaign Map Display" color name="Player Score Color"]
vec3 S_Campaign_MapPlayerScoreColor = vec3(1, 1, 1);

[Setting category="Campaign Map Display" name="Highlight Your Score"]
bool S_Campaign_MapHighlight = false;

[Setting category="Campaign Map Display" name="Highlight Rainbow"]
bool S_Campaign_MapHighlightRainbow = false;

[Setting category="Campaign Map Display" color name="Highlight Position Color"]
vec3 S_Campaign_MapHighlightPositionColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Map Display" color name="Highlight Name Color"]
vec3 S_Campaign_MapHighlightNameColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Map Display" color name="Highlight Zone Color"]
vec3 S_Campaign_MapHighlightZoneColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Map Display" color name="Highlight Score Color"]
vec3 S_Campaign_MapHighlightScoreColor = vec3(.94f, .77f, .19f);