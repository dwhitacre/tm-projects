with ruleCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Simplified Rules', 0)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('Open to anyone, Regular start time is Saturdays at 4pm Eastern, Qualifier is 20 rounds, Top 8 from qualifier advance to 1v1 single elim bracket', 0, (select RuleCategoryId from ruleCategory)),
  ('Quarterfinals is best of 3, Semifinals best of 5, Finals best of 7. 5 round wins takes the map', 1, (select RuleCategoryId from ruleCategory));

with eventOverviewCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Event Overview', 1)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('This weekly event is open to anyone who wishes to participate', 0, (select RuleCategoryId from eventOverviewCategory)),
  ('The competition will begin at 4pm EST with the qualifier match each week unless otherwise announced', 1, (select RuleCategoryId from eventOverviewCategory)),
  ('The Map Pool is chosen by HD, these maps are a variety of previous TOTDs, Campaign Maps, or any other map HD chooses', 2, (select RuleCategoryId from eventOverviewCategory)),
  ('The Map Pool will consist of 8 maps each week and can be found in the Kentucky Trackmania Club in game.', 3, (select RuleCategoryId from eventOverviewCategory)),
  ('Two maps will rotate each week, the two rotating out will be the 01 and 02 maps in the campaign and will also be highlighted in that weeks sheet', 4, (select RuleCategoryId from eventOverviewCategory)),
  ('Maps can be suggested by the players anytime in the weekly league map suggestion channel in the Kentucky Trackmania Discord', 5, (select RuleCategoryId from eventOverviewCategory));

with registrationCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'How to Register/Play', 2)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('Simple, show up to the qualifier. Qualifier room will be up 10 minutes before Qualifier goes live promptly at 4pm EST', 0, (select RuleCategoryId from registrationCategory)),
  ('Qualifier and all Match Rooms will be in the Kentucky Trackmania Club', 1, (select RuleCategoryId from registrationCategory));

with qualificationCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Qualification', 3)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('Each week''s event will start with a qualifier match', 0, (select RuleCategoryId from qualificationCategory)),
  ('Five maps from the map pool will randomly be chosen on stream and put into a room', 1, (select RuleCategoryId from qualificationCategory)),
  ('All players for that week will play 4 rounds on each map totaling 20 rounds played', 2, (select RuleCategoryId from qualificationCategory)),
  ('The Top 8 players at the end of the 20 rounds will advance and be placed into the main bracket', 3, (select RuleCategoryId from qualificationCategory)),
  ('If there is a tie among the top 8 players that doesnt decide if a player makes the cut, the tiebreaker will be whoever has the most league points.', 4, (select RuleCategoryId from qualificationCategory)),
  ('If there is still a tie after checking league points earned: tiebreaker will be alphabetical A -> Z', 5, (select RuleCategoryId from qualificationCategory)),
  ('If there is a tie that would effect who would make it into main bracket: The Qualifier room will be reset to the first map played and the tied players will play a 1 round sudden death', 6, (select RuleCategoryId from qualificationCategory)),
  ('Example 1: If four players are tied for 7th, the four tied players will play a one round sudden death. The top 2 finishers will advance to fill the 7th and 8th seed', 7, (select RuleCategoryId from qualificationCategory)),
  ('Example 2: If 3 players are tied for 8th, the three tied players will play a one round sudden death. The winner will advance and fill the 8th seed.', 8, (select RuleCategoryId from qualificationCategory));

with mainBracketCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Main Bracket', 4)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('The Quarterfinals will be best of 3 maps, Semifinals will be best of 5 maps, Finals will be best of 7 maps', 0, (select RuleCategoryId from mainBracketCategory)),
  ('Maps for each match will be selected by a draft', 1, (select RuleCategoryId from mainBracketCategory)),
  ('For each match a thread will be made in the events general channel of the discord, the players in that match will be pinged and draft their maps', 2, (select RuleCategoryId from mainBracketCategory)),
  ('The player with the better seed will begin the draft picking the first map, the players will alternate picks', 3, (select RuleCategoryId from mainBracketCategory)),
  ('*QUARTERFINALS ONLY* Before draft begins each player will ban one map from the pool, Due to being reduced to a best of 3 for time.', 4, (select RuleCategoryId from mainBracketCategory)),
  ('*QUARTERFINALS ONLY* The player with the better seed will ban first, then opponent. After bans the draft will proceed as normal', 5, (select RuleCategoryId from mainBracketCategory)),
  ('In the quarterfinals each player will choose 1 map, semis each player will choose 2 maps, and finals each player will choose 3 maps', 6, (select RuleCategoryId from mainBracketCategory)),
  ('The final map in each match will be chosen by HD', 7, (select RuleCategoryId from mainBracketCategory)),
  ('Each map will be played first to 5 round wins', 8, (select RuleCategoryId from mainBracketCategory)),
  ('The player who reaches 5 round wins first, wins the map', 9, (select RuleCategoryId from mainBracketCategory));

with prizePoolCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Prize Pool', 5)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('There will be a $100 prize pool (minimum) each week', 0, (select RuleCategoryId from prizePoolCategory)),
  ('First place will win $70', 1, (select RuleCategoryId from prizePoolCategory)),
  ('Second place will win $30', 2, (select RuleCategoryId from prizePoolCategory));

with leaguePointsCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'League Points', 6)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('Points will be awarded each week', 0, (select RuleCategoryId from leaguePointsCategory)),
  ('Players will accumulate points throughout the year', 1, (select RuleCategoryId from leaguePointsCategory)),
  ('The top 8 players with the most league points at the end of the year will be invited to a special event with a $1,000 prize pool', 2, (select RuleCategoryId from leaguePointsCategory)),
  ('This event is projected to be the first or second weekend of December, exact date and details will be released at a later time', 3, (select RuleCategoryId from leaguePointsCategory));

with rulesTechnicalIssuesCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Rules / Technical Issues', 7)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('In case of a player disconnection or any other technical issue that prevents a player from playing in a main bracket match, they are entitled to a technical pause. If the technical issue occurs mid-round, then the round when the event occurred is still counted towards the match. During a technical pause, players are not allowed to drive until one of the following conditions apply:', 0, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('(a) the technical problem has been resolved (player reconnected, fixed input device, etc.),', 1, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('(b) 5 minutes have passed since the occurrence of the technical problem.', 2, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('', 3, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('Friendly trash-talk is permitted so long as all players involved are okay with it.', 4, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('Toxicity in match or on the league''s discord channel are strictly forbidden.', 5, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('Continued toxicity will result in a ban from the league.', 6, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('', 7, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('If a player is to forfeit after qualifier but before quarterfinals, they will lose their qualification spot. The results of the qualifier will slide up positions to replace the forfeited player', 8, (select RuleCategoryId from rulesTechnicalIssuesCategory)),
  ('If a player is to forfeit after quartefinals, their opponent will be awarded a X-0 win and rest of bracket will continue as usual', 9, (select RuleCategoryId from rulesTechnicalIssuesCategory));

with disclaimerCategory as (
  insert into RuleCategory (LeaderboardId, Name, SortOrder)
  values ('standings', 'Disclaimer', 8)
  returning RuleCategoryId
)
insert into Rule (Content, SortOrder, RuleCategoryId) values
  ('The organizer and admins reserve the right to change these rules at any time.', 0, (select RuleCategoryId from disclaimerCategory)),
  ('Any changes made to the rules will be announced in the HDs Announcements Channel in the discord', 1, (select RuleCategoryId from disclaimerCategory));

---- create above / drop below ----

delete from Rule;
delete from RuleCategory;