alter table Leaderboard
add column ClubId varchar default '',
add column CampaignId varchar default '';

---- create above / drop below ----

alter table Leaderboard
drop column CampaignId,
drop column ClubId;
