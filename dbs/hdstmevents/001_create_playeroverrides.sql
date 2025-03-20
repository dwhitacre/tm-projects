create table PlayerOverrides(
  AccountId varchar not null primary key,
  Name varchar not null default '',
  Image varchar not null default '',
  Twitch varchar not null default '',
  Discord varchar not null default ''
);

---- create above / drop below ----

drop table PlayerOverrides;
