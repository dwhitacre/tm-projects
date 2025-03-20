alter table LeaderboardWeekly add constraint leaderboardweekly_leaderboardid_weeklyid_key unique (LeaderboardId, WeeklyId);

---- create above / drop below ----

alter table LeaderboardWeekly drop constraint leaderboardweekly_leaderboardid_weeklyid_key;
