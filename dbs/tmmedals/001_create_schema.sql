create table Maps(
  MapUid varchar not null primary key,
  AuthorTime int not null,
  Name varchar not null default '',
  Campaign varchar,
  CampaignIndex int,
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table Players(
  AccountId varchar not null primary key,
  Name varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table Zones(
  ZoneId varchar not null primary key,
  Name varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table MedalTimes(
  Id serial primary key,
  MapUid varchar not null,
  MedalTime int not null default -1,
  CustomMedalTime int not null default -1,
  Reason varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc'),
  AccountId varchar,
  ZoneId varchar,
  foreign key(MapUid) references Maps(MapUid),
  foreign key(AccountId) references Players(AccountId),
  foreign key(ZoneId) references Zones(ZoneId),
  unique(MapUid, AccountId),
  unique(MapUid, ZoneId)
);

---- create above / drop below ----

drop table MedalTimes;
drop table Zones;
drop table Players;
drop table Maps;
