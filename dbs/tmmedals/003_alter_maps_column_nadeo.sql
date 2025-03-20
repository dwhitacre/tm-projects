alter table Maps
add Nadeo boolean not null default false;

---- create above / drop below ----

alter table Maps
drop column Nadeo;
