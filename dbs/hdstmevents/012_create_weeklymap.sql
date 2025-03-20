create table WeeklyMap(
  WeeklyMapId serial primary key,
  WeeklyId varchar not null,
  MapUid varchar not null,
  foreign key(WeeklyId) references Weekly(WeeklyId),
  foreign key(MapUid) references Map(MapUid)
);

---- create above / drop below ----

drop table WeeklyMap;
