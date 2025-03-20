insert into Weekly (WeeklyId)
values
  ('2024-04-27'),
  ('2024-05-04'),
  ('2024-05-11'),
  ('2024-05-17');

insert into WeeklyMatch (WeeklyId, MatchId)
values
  ('2024-04-27', '2024-04-27-finals'),
  ('2024-04-27', '2024-04-27-firstround-a'),
  ('2024-04-27', '2024-04-27-firstround-b'),
  ('2024-04-27', '2024-04-27-firstround-c'),
  ('2024-04-27', '2024-04-27-firstround-d'),
  ('2024-04-27', '2024-04-27-firstround-e'),
  ('2024-04-27', '2024-04-27-firstround-f'),
  ('2024-04-27', '2024-04-27-firstround-g'),
  ('2024-04-27', '2024-04-27-firstround-h'),
  ('2024-04-27', '2024-04-27-qualifying'),
  ('2024-04-27', '2024-04-27-quarterfinal-i'),
  ('2024-04-27', '2024-04-27-quarterfinal-j'),
  ('2024-04-27', '2024-04-27-quarterfinal-k'),
  ('2024-04-27', '2024-04-27-quarterfinal-l'),
  ('2024-04-27', '2024-04-27-semifinal-m'),
  ('2024-04-27', '2024-04-27-semifinal-n'),
  ('2024-05-04', '2024-05-04-finals'),
  ('2024-05-04', '2024-05-04-qualifying'),
  ('2024-05-04', '2024-05-04-quarterfinal-a'),
  ('2024-05-04', '2024-05-04-quarterfinal-b'),
  ('2024-05-04', '2024-05-04-quarterfinal-c'),
  ('2024-05-04', '2024-05-04-quarterfinal-d'),
  ('2024-05-04', '2024-05-04-semifinal-a'),
  ('2024-05-04', '2024-05-04-semifinal-b'),
  ('2024-05-11', '2024-05-11-finals'),
  ('2024-05-11', '2024-05-11-qualifying'),
  ('2024-05-11', '2024-05-11-quarterfinal-a'),
  ('2024-05-11', '2024-05-11-quarterfinal-b'),
  ('2024-05-11', '2024-05-11-quarterfinal-c'),
  ('2024-05-11', '2024-05-11-quarterfinal-d'),
  ('2024-05-11', '2024-05-11-semifinal-a'),
  ('2024-05-11', '2024-05-11-semifinal-b'),
  ('2024-05-17', '2024-05-17-qualifying'),
  ('2024-05-17', '2024-05-17-quarterfinal-a'),
  ('2024-05-17', '2024-05-17-quarterfinal-b'),
  ('2024-05-17', '2024-05-17-quarterfinal-c'),
  ('2024-05-17', '2024-05-17-quarterfinal-d'),
  ('2024-05-17', '2024-05-17-semifinal-a'),
  ('2024-05-17', '2024-05-17-semifinal-b'),
  ('2024-05-17', '2024-05-17-finals');

---- create above / drop below ----

delete from WeeklyMatch;
delete from Weekly;
