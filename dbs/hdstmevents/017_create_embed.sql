create table Embed(
  EmbedId serial primary key,
  EventId int not null,
  Title varchar(256) default '',
  Description text default '',
  Image varchar(256) default '',
  Url varchar(256) default '',
  Type varchar(64) default '',
  LocalImage varchar(128) not null,
  Host varchar(128) not null,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  DateExpired timestamp not null,
  foreign key(EventId) references Event(EventId),
  constraint embed_eventid_host_unique unique (EventId, Host),
  constraint embed_localimage_host_unique unique (LocalImage, Host)
);

---- create above / drop below ----

drop table Embed;