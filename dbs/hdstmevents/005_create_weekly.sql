create table Weekly(
  WeeklyId varchar not null primary key
);

create table WeeklyMatch(
  WeeklyMatchId serial primary key,
  WeeklyId varchar not null,
  MatchId varchar not null,
  foreign key(WeeklyId) references Weekly(WeeklyId),
  foreign key(MatchId) references Match(MatchId)
);

---- create above / drop below ----

drop table WeeklyMatch;
drop table Weekly;
