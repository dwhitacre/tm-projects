create table Leaderboard(
  LeaderboardId varchar not null primary key,
  LastModified varchar not null default ''
);

create table LeaderboardWeekly(
  LeaderboardWeeklyId serial primary key,
  LeaderboardId varchar not null,
  WeeklyId varchar not null,
  foreign key(LeaderboardId) references Leaderboard(LeaderboardId),
  foreign key(WeeklyId) references Weekly(WeeklyId)
);

---- create above / drop below ----

drop table LeaderboardWeekly;
drop table Leaderboard;
