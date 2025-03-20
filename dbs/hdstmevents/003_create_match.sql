create table Match(
  MatchId varchar not null primary key,
  PlayersAwarded int not null default 0,
  PointsAwarded int not null default 0
);

create table MatchResult(
  MatchResultId serial primary key,
  MatchId varchar not null,
  AccountId varchar not null,
  Score int not null default 0,
  foreign key(MatchId) references Match(MatchId)
);

---- create above / drop below ----

drop table MatchResult;
drop table Match;
