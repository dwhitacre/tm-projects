create table Player(
  AccountId varchar not null primary key,
  TmioData varchar not null default ''
);

create table PlayerOverrides(
  AccountId varchar not null primary key,
  Name varchar not null default '',
  Image varchar not null default '',
  Twitch varchar not null default '',
  Discord varchar not null default '',
  foreign key(AccountId) references Player(AccountId)
);

create table Leaderboard(
  LeaderboardId serial primary key,
  Name varchar not null default '',
  LastModified timestamp not null default now()
);

create table LeaderboardScore(
  AccountId varchar not null,
  LeaderboardId int not null,
  Score int not null default 0,
  foreign key(LeaderboardId) references Leaderboard(LeaderboardId),
  foreign key(AccountId) references Player(AccountId),
  constraint leaderboardscore_leaderboardid_accountid_key unique (LeaderboardId, AccountId)
);

---- create above / drop below ----

drop table Leaderboard;
drop table LeaderboardScore;
drop table PlayerOverrides;
drop table Player;
