insert into Leaderboard (LeaderboardId, LastModified)
values
  ('standings', '2024-05-17T01:10:00+00:00');

insert into LeaderboardWeekly (LeaderboardId, WeeklyId)
values
  ('standings', '2024-04-27'),
  ('standings', '2024-05-04'),
  ('standings', '2024-05-11'),
  ('standings', '2024-05-17');

---- create above / drop below ----

delete from LeaderboardWeekly;
delete from Leaderboard;
