create table RuleCategory(
  RuleCategoryId serial primary key,
  LeaderboardId varchar not null,
  Name varchar(256) default '',
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  foreign key(LeaderboardId) references Leaderboard(LeaderboardId)
);

create table Rule(
  RuleId serial primary key,
  Content varchar(10240) default '',
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  RuleCategoryId int not null,
  foreign key(RuleCategoryId) references RuleCategory(RuleCategoryId)
);

---- create above / drop below ----

drop table Rule;
drop table RuleCategory;
