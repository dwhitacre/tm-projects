create table Permissions(
  Id serial primary key,
  Name varchar not null
);

insert into Permissions(Name)
values
  ('view'),
  ('player:manage'),
  ('zone:manage'),
  ('map:manage'),
  ('medaltimes:manage'),
  ('apikey:manage'),
  ('admin');

create table PlayerPermissions(
  Id serial primary key,
  AccountId varchar not null,
  PermissionId int not null,
  DateModified timestamp not null default (now() at time zone 'utc'),
  foreign key(AccountId) references Players(AccountId),
  foreign key(PermissionId) references Permissions(Id),
  unique(AccountId, PermissionId)
);

create table ApiKeys(
  Id serial primary key,
  AccountId varchar not null,
  Key varchar not null,
  DateModified timestamp not null default (now() at time zone 'utc'),
  foreign key(AccountId) references Players(AccountId),
  unique(AccountId)
);

---- create above / drop below ----

drop table ApiKeys;
drop table PlayerPermissions;
drop table Permissions;
