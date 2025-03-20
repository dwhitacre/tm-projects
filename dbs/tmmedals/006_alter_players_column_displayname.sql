alter table Players
add DisplayName varchar not null default '';

---- create above / drop below ----

alter table Players
drop column DisplayName;
