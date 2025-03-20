alter table Players
add Color varchar not null default '3F3';

---- create above / drop below ----

alter table Players
drop column Color;
