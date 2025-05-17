create table Organization(
  OrganizationId serial primary key,
  Name varchar(256) default '',
  Description text default '',
  Image varchar(256) default '',
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now()
);

create table TeamRole(
  TeamRoleId serial primary key,
  Name varchar(256) default '',
  SortOrder int not null default 0,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  OrganizationId int not null,
  foreign key(OrganizationId) references Organization(OrganizationId),
  constraint teamrole_organizationid_name_unique unique (OrganizationId, Name)
);

create table Team(
  TeamId serial primary key,
  Name varchar(256) default '',
  Description text default '',
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  OrganizationId int not null,
  foreign key(OrganizationId) references Organization(OrganizationId),
  constraint team_organizationid_name_unique unique (OrganizationId, Name)
);

create table TeamPlayer(
  TeamPlayerId serial primary key,
  TeamId int not null,
  AccountId varchar not null,
  TeamRoleId int not null,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  foreign key(TeamId) references Team(TeamId),
  foreign key(AccountId) references Player(AccountId),
  foreign key(TeamRoleId) references TeamRole(TeamRoleId),
  constraint teamplayer_teamid_accountid_teamroleid_unique unique (TeamId, AccountId, TeamRoleId)
);

create table Post(
  PostId serial primary key,
  AccountId varchar not null,
  Title varchar(256) default '',
  Description text default '',
  Image varchar(256) default '',
  Content text default '',
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  OrganizationId int not null,
  foreign key(OrganizationId) references Organization(OrganizationId),
  foreign key(AccountId) references Player(AccountId)
);

create table Tag(
  TagId serial primary key,
  Name varchar(256) default '',
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  OrganizationId int not null,
  foreign key(OrganizationId) references Organization(OrganizationId),
  constraint tag_organizationid_name_unique unique (OrganizationId, Name)
);

create table PostTag(
  PostTagId serial primary key,
  PostId int not null,
  TagId int not null,
  SortOrder int not null default 0,
  IsVisible boolean not null default true,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  foreign key(PostId) references Post(PostId),
  foreign key(TagId) references Tag(TagId),
  constraint posttag_postid_tagid_unique unique (PostId, TagId)
);

create table Event(
  EventId serial primary key,
  Name varchar(256) default '',
  Description text default '',
  Image varchar(256) default '',
  DateStart timestamp null,
  DateEnd timestamp null,
  ExternalUrl varchar(1024) default '',
  IsVisible boolean not null default true,
  SortOrder int not null default 0,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  OrganizationId int not null,
  foreign key(OrganizationId) references Organization(OrganizationId)
);

create table EventPlayer(
  EventPlayerId serial primary key,
  EventId int not null,
  TeamPlayerId int not null,
  EventRoleId int not null,
  DateCreated timestamp not null default now(),
  DateModified timestamp not null default now(),
  foreign key(EventId) references Event(EventId),
  foreign key(TeamPlayerId) references TeamPlayer(TeamPlayerId),
  foreign key(EventRoleId) references TeamRole(TeamRoleId),
  constraint eventplayer_eventid_teamplayerid_eventroleid_unique unique (EventId, TeamPlayerId, EventRoleId)
);


---- create above / drop below ----

drop table EventPlayer;
drop table Event;
drop table PostTag;
drop table Tag;
drop table Post;
drop table TeamPlayer;
drop table Team;
drop table TeamRole;
drop table Organization;
