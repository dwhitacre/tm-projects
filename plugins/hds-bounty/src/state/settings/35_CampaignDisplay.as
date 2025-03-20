[Setting category="Campaign Display" name="Show Bounty Name"]
bool S_Campaign_ShowBountyName = true;

[Setting category="Campaign Display" name="Show Campaign Leaderboard"]
bool S_Campaign_ShowGroupLeaderboard = true;

[Setting category="Campaign Display" min=1 max=5 name="Campaign Leaderboard Number of Records"]
uint S_Campaign_GroupNumRecords = 5;

[Setting category="Campaign Display" name="Show Campaign Leaderboard Header"]
bool S_Campaign_ShowGroupHeader = true;

[Setting category="Campaign Display" color name="Campaign Leaderboard Header Color"]
vec3 S_Campaign_GroupHeaderColor = vec3(0.75f, 0.75f, 0.75f);

[Setting category="Campaign Display" color name="Campaign Leaderboard Player Position Color"]
vec3 S_Campaign_GroupPlayerPositionColor = vec3(1, 1, 1);

[Setting category="Campaign Display" color name="Campaign Leaderboard Player Name Color"]
vec3 S_Campaign_GroupPlayerNameColor = vec3(1, 1, 1);

[Setting category="Campaign Display" name="Show Campaign Leaderboard Player Zone"]
bool S_Campaign_ShowGroupPlayerZone = true;

[Setting category="Campaign Display" color name="Campaign Leaderboard Player Zone Color"]
vec3 S_Campaign_GroupPlayerZoneColor = vec3(1, 1, 1);

[Setting category="Campaign Display" color name="Campaign Leaderboard Player Score Color"]
vec3 S_Campaign_GroupPlayerScoreColor = vec3(1, 1, 1);

[Setting category="Campaign Display" name="Campaign Leaderboard Always Show Your Score" description="If you are not in the top 5, show your information at the bottom of the leaderboard."]
bool S_Campaign_AlwaysShowYou = true;

[Setting category="Campaign Display" name="Campaign Leaderboard Highlight Your Score"]
bool S_Campaign_GroupHighlight = false;

[Setting category="Campaign Display" name="Campaign Leaderboard Highlight Rainbow"]
bool S_Campaign_GroupHighlightRainbow = false;

[Setting category="Campaign Display" name="Campaign Leaderboard Highlight Rainbow Color" hidden]
vec3 S_Campaign_GroupHighlightRainbowColor = vec3(1, 0, 0);

[Setting category="Campaign Display" name="Campaign Leaderboard Highlight Rainbow Interval" min=0.f max=.03f description="Step interval for rainbow effect. Smaller numbers mean slower transitions."]
float S_Campaign_GroupHighlightRainbowInterval = 0.01f;

[Setting category="Campaign Display" color name="Campaign Leaderboard Highlight Position Color"]
vec3 S_Campaign_GroupHighlightPositionColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Display" color name="Campaign Leaderboard Highlight Name Color"]
vec3 S_Campaign_GroupHighlightNameColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Display" color name="Campaign Leaderboard Highlight Zone Color"]
vec3 S_Campaign_GroupHighlightZoneColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Display" color name="Campaign Leaderboard Highlight Score Color"]
vec3 S_Campaign_GroupHighlightScoreColor = vec3(.94f, .77f, .19f);

[Setting category="Campaign Display" color name="Campaign Leaderboard Highlight Account Id" hidden]
string S_Campaign_GroupHighlightYourAccountId = "";