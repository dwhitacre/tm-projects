-- DELETE FROM EventPlayer;
-- DELETE FROM PostTag;
-- DELETE FROM Tag;
-- DELETE FROM TeamPlayer;
-- DELETE FROM TeamRole;
-- DELETE FROM Event;
-- DELETE FROM Post;
-- DELETE FROM Team;
-- DELETE FROM Player;

-- Seed Player
WITH ins_player AS (
  INSERT INTO Player (AccountId, TmioData)
  VALUES
    ('794a286c-44d9-4276-83ce-431cba7bab74', '{"accountid":"794a286c-44d9-4276-83ce-431cba7bab74","displayname":"Player1","trophies":{"zone":{"flag":"USA","parent":{"flag":"NA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('89894a9a-957c-4c88-8d88-3149283ca2bd', '{"accountid":"89894a9a-957c-4c88-8d88-3149283ca2bd","displayname":"Player2","trophies":{"zone":{"flag":"CAN","parent":{"flag":"NA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('09747490-4eeb-410c-aa49-58ee38481760', '{"accountid":"09747490-4eeb-410c-aa49-58ee38481760","displayname":"Player3","trophies":{"zone":{"flag":"UK","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('fcad7ce0-49ac-4c56-ac19-ecfca890a451', '{"accountid":"fcad7ce0-49ac-4c56-ac19-ecfca890a451","displayname":"Player4","trophies":{"zone":{"flag":"AUS","parent":{"flag":"OCE","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('83b5f677-3296-4d2a-ad6b-5a100565de22', '{"accountid":"83b5f677-3296-4d2a-ad6b-5a100565de22","displayname":"Player5","trophies":{"zone":{"flag":"GER","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('dae72d20-d7d1-4908-ac8b-9ae1994cb3b4', '{"accountid":"dae72d20-d7d1-4908-ac8b-9ae1994cb3b4","displayname":"Player6","trophies":{"zone":{"flag":"FRA","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('c7818ba0-5e85-408e-a852-f658e8b90eec', '{"accountid":"c7818ba0-5e85-408e-a852-f658e8b90eec","displayname":"Player7","trophies":{"zone":{"flag":"JPN","parent":{"flag":"ASIA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('a1accb5b-a4f1-43a7-ada7-119a890b12f1', '{"accountid":"a1accb5b-a4f1-43a7-ada7-119a890b12f1","displayname":"Player8","trophies":{"zone":{"flag":"IND","parent":{"flag":"ASIA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('6b9a48bf-a0b4-452a-9151-1e3b53133faf', '{"accountid":"6b9a48bf-a0b4-452a-9151-1e3b53133faf","displayname":"Player9","trophies":{"zone":{"flag":"BRA","parent":{"flag":"SA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('6e3bf3f9-7dcb-47d4-bdae-037ab66628f2', '{"accountid":"6e3bf3f9-7dcb-47d4-bdae-037ab66628f2","displayname":"Player10","trophies":{"zone":{"flag":"MEX","parent":{"flag":"NA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('f5e37115-d85a-4f3e-bc5a-969d6e29fede', '{"accountid":"f5e37115-d85a-4f3e-bc5a-969d6e29fede","displayname":"Player11","trophies":{"zone":{"flag":"ARG","parent":{"flag":"SA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('f77223ad-cddc-466e-8680-38edc9057f2d', '{"accountid":"f77223ad-cddc-466e-8680-38edc9057f2d","displayname":"Player12","trophies":{"zone":{"flag":"ITA","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('b8c5c3a0-4cac-4eba-abd4-2f55afab04e2', '{"accountid":"b8c5c3a0-4cac-4eba-abd4-2f55afab04e2","displayname":"Player13","trophies":{"zone":{"flag":"ESP","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('3d11c8f8-258b-433f-9395-7c6f42f7784e', '{"accountid":"3d11c8f8-258b-433f-9395-7c6f42f7784e","displayname":"Player14","trophies":{"zone":{"flag":"CHN","parent":{"flag":"ASIA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('a16a44f5-dc0-47e1-bf00-6174fec76bf1', '{"accountid":"a16a44f5-dc0-47e1-bf00-6174fec76bf1","displayname":"Player15","trophies":{"zone":{"flag":"KOR","parent":{"flag":"ASIA","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('943245e6-cc01-40ec-80f9-77bb2cbb5914', '{"accountid":"943245e6-cc01-40ec-80f9-77bb2cbb5914","displayname":"Player16","trophies":{"zone":{"flag":"RUS","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('d85fd2cc-bf6a-44a7-88cc-9d8695b82b88', '{"accountid":"d85fd2cc-bf6a-44a7-88cc-9d8695b82b88","displayname":"Player17","trophies":{"zone":{"flag":"SWE","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('70d7c4d4-ff63-4579-9069-05eaf5e60399', '{"accountid":"70d7c4d4-ff63-4579-9069-05eaf5e60399","displayname":"Player18","trophies":{"zone":{"flag":"NOR","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('a6d27eb1-55ff-4c54-a8da-6fd5fb064f95', '{"accountid":"a6d27eb1-55ff-4c54-a8da-6fd5fb064f95","displayname":"Player19","trophies":{"zone":{"flag":"DEN","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('d2f9cf26-60c2-4e5e-8770-c1a78cad1124', '{"accountid":"d2f9cf26-60c2-4e5e-8770-c1a78cad1124","displayname":"Player20","trophies":{"zone":{"flag":"FIN","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('3da84e95-ec21-4635-bc0c-47dc0dbbc62c', '{"accountid":"3da84e95-ec21-4635-bc0c-47dc0dbbc62c","displayname":"Player21","trophies":{"zone":{"flag":"POL","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('62687d40-1291-484b-be06-d6810bf78606', '{"accountid":"62687d40-1291-484b-be06-d6810bf78606","displayname":"Player22","trophies":{"zone":{"flag":"CZE","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('4d9676aa-4bd0-4120-b9e5-9b727b697108', '{"accountid":"4d9676aa-4bd0-4120-b9e5-9b727b697108","displayname":"Player23","trophies":{"zone":{"flag":"HUN","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('53d6f5df-7a48-437f-aa3c-ced48894826e', '{"accountid":"53d6f5df-7a48-437f-aa3c-ced48894826e","displayname":"Player24","trophies":{"zone":{"flag":"AUT","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}'),
    ('7886c8e0-902c-4b63-b9c4-59153d98aaaa', '{"accountid":"7886c8e0-902c-4b63-b9c4-59153d98aaaa","displayname":"Player25","trophies":{"zone":{"flag":"SUI","parent":{"flag":"EU","parent":{"flag":"WORLD","parent":{"flag":"GLOBAL"}}}}}}')
  ON CONFLICT (AccountId) DO NOTHING
  RETURNING AccountId
),
all_player AS (
  SELECT AccountId FROM ins_player
  UNION
  SELECT AccountId FROM Player
)

-- Seed Organization
, ins_organization AS (
  INSERT INTO Organization (Name, Description, DateCreated, DateModified)
  VALUES
    ('Holy Dynasty', 'A community of Trackmania enthusiasts.', '2025-01-01', '2025-05-01')
  ON CONFLICT DO NOTHING
  RETURNING OrganizationId, Name
),
all_organization AS (
  SELECT OrganizationId FROM ins_organization
)

-- Seed Team (add OrganizationId)
, ins_team AS (
  INSERT INTO Team (Name, Description, SortOrder, IsVisible, DateCreated, DateModified, OrganizationId)
  SELECT v.Name, v.Description, v.SortOrder, v.IsVisible, v.DateCreated::timestamp, v.DateModified::timestamp, o.OrganizationId
  FROM (VALUES
    ('Speed Demons', 'A team of the fastest players.', 1, true, '2024-11-15', '2025-01-10'),
    ('Turbo Titans', 'Masters of turbo tracks.', 2, true, '2024-12-01', '2025-02-20'),
    ('Nitro Ninjas', 'Stealthy and fast.', 3, true, '2025-01-05', '2025-03-15'),
    ('Velocity Vipers', 'Striking with speed.', 4, true, '2025-01-20', '2025-04-01'),
    ('Rocket Racers', 'Blazing through the tracks.', 5, true, '2025-02-10', '2025-05-01')
  ) AS v(Name, Description, SortOrder, IsVisible, DateCreated, DateModified)
  CROSS JOIN all_organization o
  ON CONFLICT DO NOTHING
  RETURNING TeamId, Name
),
all_team AS (
  SELECT TeamId, Name FROM ins_team
  UNION
  SELECT TeamId, Name FROM Team
)

-- Seed Post (add OrganizationId)
, ins_post AS (
  INSERT INTO Post (AccountId, Title, Description, Image, Content, SortOrder, IsVisible, DateCreated, DateModified, OrganizationId)
  SELECT v.AccountId, v.Title, v.Description, v.Image, v.Content, v.SortOrder, v.IsVisible, v.DateCreated::timestamp, v.DateModified::timestamp, o.OrganizationId
  FROM (VALUES
    ('794a286c-44d9-4276-83ce-431cba7bab74', 'Trackmania Update', 'The latest Trackmania update brings exciting new features, bug fixes, and performance improvements. Players can now enjoy a smoother gaming experience with enhanced graphics and gameplay mechanics. This update also includes new tracks and challenges to keep the community engaged.', 'assets/images/dotm.webp', 'Trackmania has introduced a host of new features in its latest update. This marks a significant milestone for the community, as many long-awaited improvements have finally arrived. The development team has worked tirelessly to ensure a seamless experience for all players. Feedback from the community has been overwhelmingly positive, with many praising the attention to detail. The update is expected to set a new standard for future releases.\n\nPlayers will notice significant improvements in the game’s performance, making it more enjoyable and accessible. The update also addresses several bugs that were reported by the community, ensuring a smoother experience for everyone. These fixes target both minor annoyances and major gameplay issues, resulting in a more stable environment. Many players have already commented on the reduced load times and increased frame rates. The technical team has published a detailed changelog to highlight all the improvements.\n\nOne of the highlights of this update is the addition of new tracks. These tracks are designed to challenge players’ skills and creativity, offering a fresh take on the classic Trackmania gameplay. The developers have also included new customization options, allowing players to personalize their vehicles and tracks. The new tracks feature unique obstacles and creative layouts, pushing the boundaries of what’s possible in the game. Customization now extends to decals, paint jobs, and even sound effects. Players can share their creations with the community, fostering a sense of collaboration.\n\nIn addition to these features, the update brings enhanced graphics that make the game more visually appealing. The lighting and textures have been improved, creating a more immersive environment. Players can also look forward to new events and competitions that will be hosted in the coming weeks. The visual overhaul includes dynamic weather effects and improved reflections, making every race feel more lifelike. Upcoming competitions promise exclusive rewards and fierce rivalries. The graphics team has worked closely with artists to ensure a cohesive look and feel.\n\nThe community has already started exploring the new features, sharing their experiences and feedback. This update is a testament to the developers’ commitment to continuously improving the game. Social media is abuzz with clips of impressive stunts and creative track designs. The feedback loop between players and developers has never been stronger, ensuring that future updates will be even more tailored to the community’s needs. Community-driven events are being planned to celebrate the update.\n\nOverall, the latest Trackmania update is a must-try for both new and veteran players. It sets the stage for an exciting future for the game, with more updates and features expected in the coming months. The sense of anticipation is palpable, as players speculate about what’s next. Whether you’re a casual racer or a competitive pro, there’s something in this update for everyone. The developers have promised to keep listening to feedback and making improvements.\n\nThe update also introduces a new ranking system, allowing players to track their progress and compete with others on a global scale. This feature has been highly requested by the community and adds a new layer of excitement to the game. The ranking system includes seasonal resets and special badges for top performers, encouraging players to keep improving. Leaderboards are now more accessible and provide detailed statistics. Players can compare their progress with friends and rivals alike.\n\nIn conclusion, the latest Trackmania update is a comprehensive package that caters to both casual and competitive players. It’s a testament to the developers’ dedication to creating a game that is both fun and challenging. The future looks bright for Trackmania, and the community can look forward to even more innovations in the months ahead. The update has set a new benchmark for quality and engagement. Players are already looking forward to the next big announcement.\n\nMoreover, the update has brought a new level of accessibility to the game. Players with different skill levels can now find modes and challenges that suit their preferences. This inclusivity has been widely appreciated by the community. Tutorials and onboarding have been revamped, making it easier for newcomers to get started. Accessibility options have been expanded to accommodate a wider range of players.\n\nThe developers have also introduced seasonal events that will keep the game fresh and engaging. These events are designed to bring the community together, fostering a sense of camaraderie and competition. Special event tracks and limited-time challenges will keep players coming back for more. Rewards for participation include unique cosmetics and in-game currency. The event calendar is packed with exciting activities for all.\n\nThe update has also focused on enhancing the game’s audio experience. From the roar of engines to the ambient sounds of the tracks, every detail has been fine-tuned to create an immersive experience. New soundtracks and effects add depth to the gameplay, making each race a sensory delight. The audio team collaborated with musicians to create a memorable score. Players can now customize their in-game audio settings for a personalized experience.\n\nIn addition, the update has expanded the game’s lore, providing players with a deeper understanding of the Trackmania universe. This narrative element adds a new dimension to the game, making it more engaging and memorable. Story-driven events and character backstories are now part of the experience. Players can unlock lore entries by completing specific challenges. The lore has sparked discussions and theories within the community.\n\nFinally, the update has set the stage for future expansions and features. The developers have hinted at exciting new content that will be unveiled in the coming months. This forward-looking approach ensures that Trackmania will continue to evolve and captivate its audience. The roadmap includes new game modes, cross-platform play, and more community-driven content. Players are encouraged to submit their ideas for future updates.', 1, true, '2024-11-20', '2025-01-15'),
    ('89894a9a-957c-4c88-8d88-3149283ca2bd', 'Upcoming Tournament', 'Get ready for the upcoming Trackmania tournament, featuring top players from around the world. This event promises intense competition, thrilling races, and a showcase of incredible skills. Don’t miss the chance to witness history in the making.', 'assets/images/hds-events-bg.png', 'The upcoming Trackmania tournament is set to be one of the most exciting events of the year. Anticipation is building as players from around the world prepare to compete. Organizers have promised a spectacle that will be remembered for years to come. The event is expected to draw record-breaking crowds and online viewership. Preparations are underway to ensure a flawless experience for all participants.\n\nPlayers from all over the globe will compete for the championship title, showcasing their skills and strategies. The tournament will feature a series of challenging tracks, designed to test the limits of even the most experienced players. Each track has been meticulously crafted to provide a unique challenge, ensuring that no two races are alike. Competitors are already strategizing and practicing to gain an edge. The stakes are higher than ever, with substantial prizes on the line.\n\nSpectators can look forward to thrilling races, as competitors push their vehicles to the limit. The event will also include live commentary, providing insights into the strategies and techniques used by the players. Fans will be able to interact with commentators and participate in live polls, adding an extra layer of excitement to the viewing experience. Special camera angles and instant replays will enhance the broadcast. The energy in the arena is expected to be electric.\n\nIn addition to the main competition, there will be side events and activities for attendees. These include meet-and-greets with top players, workshops on improving gameplay, and opportunities to try out the latest Trackmania features. Attendees can also participate in mini-tournaments and win exclusive prizes. The event will feature food stalls, merchandise booths, and interactive exhibits. There will be something for everyone, regardless of skill level.\n\nThe tournament is not just about competition; it’s also a celebration of the Trackmania community. Fans and players will come together to share their passion for the game, creating an unforgettable experience. Community booths and fan art displays will showcase the creativity and enthusiasm of Trackmania’s player base. The event will foster new friendships and strengthen existing bonds. Organizers hope to make this an annual tradition.\n\nWhether you’re a seasoned player or a newcomer to Trackmania, this tournament is an event you won’t want to miss. Mark your calendars and get ready for an action-packed weekend. The event promises something for everyone, from high-stakes races to casual fun. There will be opportunities to learn from the best and improve your skills. The memories made here will last a lifetime.\n\nThe event organizers have also planned a series of giveaways and contests for attendees. These activities are designed to engage the community and add an extra layer of excitement to the event. Prizes include rare in-game items, merchandise, and even opportunities to race against the pros. Winners will be announced throughout the event, keeping the excitement high. Participation is encouraged for all attendees.\n\nFor those unable to attend in person, the tournament will be live-streamed on various platforms. This ensures that fans from around the world can join in on the action and cheer for their favorite players. Interactive chat and real-time stats will make the online experience just as engaging as being there in person. The production team is working hard to deliver a seamless broadcast. Fans can expect behind-the-scenes content and interviews.\n\nThe tournament venue has been carefully selected to provide the best possible experience for both players and spectators. With state-of-the-art facilities and a vibrant atmosphere, it’s the perfect setting for this prestigious event. The venue will also feature food trucks, entertainment zones, and relaxation areas. Accessibility has been prioritized to ensure everyone can enjoy the event. Security measures are in place for a safe experience.\n\nAs the tournament date approaches, the excitement continues to build. Players are busy preparing and strategizing, while fans eagerly await the chance to witness history in the making. Social media is buzzing with predictions and friendly rivalries. The countdown to the big day has begun, and anticipation is at an all-time high. Organizers are providing regular updates to keep everyone informed.\n\nIn conclusion, the upcoming Trackmania tournament is more than just a competition; it’s a celebration of the game and its community. Don’t miss out on this incredible event. The memories made here will last a lifetime. Organizers are already planning future tournaments based on the success of this one. The legacy of this event will inspire future generations of players.', 2, true, '2024-12-10', '2025-02-01'),
    ('f5e37115-d85a-4f3e-bc5a-969d6e29fede', 'Trackmania Championship', 'The Trackmania Championship is the ultimate test of skill and endurance. Compete with the best players in the world and prove your mettle. This championship is a celebration of the game’s competitive spirit and community.', 'assets/images/holydynasty.png', 'The Trackmania Championship is an event that every fan of the game looks forward to. The anticipation is palpable as the best players from around the world prepare to compete for glory. The event has been months in the making, with organizers sparing no effort to ensure its success. Fans have been eagerly discussing their favorite competitors and potential outcomes. The championship is expected to set new records for participation and viewership.\n\nIt brings together the best players from around the world, competing for the prestigious title. The championship features a series of grueling tracks, each designed to test different aspects of a player’s skill. The diversity of tracks ensures that only the most versatile and skilled racers will prevail. Each race is a showcase of talent, determination, and strategy. The pressure is immense, but the rewards are even greater.\n\nFrom high-speed straights to intricate technical sections, the tracks are a true test of endurance and precision. Players must navigate these challenges while maintaining their composure under pressure. The margin for error is razor-thin, and every second counts. Spectators are treated to breathtaking displays of skill and daring maneuvers. The excitement is contagious, spreading throughout the audience.\n\nThe event is not just about the competition; it’s also a celebration of the Trackmania community. Fans gather to cheer for their favorite players, creating an electric atmosphere. The championship also includes live broadcasts, allowing fans from around the world to join in the excitement. Special guest commentators and analysts will provide expert insights throughout the event. The sense of unity and shared passion is evident in every interaction.\n\nIn addition to the main event, there are side activities and exhibitions. These include showcases of new Trackmania content, opportunities to meet the developers, and interactive sessions with top players. Attendees can participate in Q&A sessions, try out unreleased features, and collect exclusive memorabilia. The exhibition hall is filled with excitement and discovery. Fans can connect with their idols and learn from the best.\n\nThe Trackmania Championship is more than just a competition; it’s a testament to the passion and dedication of the community. It’s an event that inspires players and fans alike, setting the stage for the future of the game. The sense of unity and excitement is unmatched. The championship has become a symbol of excellence and achievement in the Trackmania world.\n\nThe championship also serves as a platform for players to showcase their creativity and innovation. From unique track designs to innovative strategies, the event highlights the best of what the community has to offer. Creative competitions and fan-voted awards will recognize outstanding contributions. The spirit of innovation is alive and well, driving the game forward.\n\nFor newcomers, the championship is an opportunity to learn from the best. Watching top players in action provides valuable insights and inspiration for improving their own gameplay. Tutorials and analysis segments will help viewers understand the finer points of competitive racing. The learning opportunities are endless, both for players and fans.\n\nThe event organizers have gone to great lengths to ensure a seamless experience for everyone involved. From state-of-the-art facilities to a well-planned schedule, every detail has been carefully considered. Attendees will enjoy comfortable seating, high-quality streaming, and a welcoming environment. The logistics team has worked tirelessly to ensure everything runs smoothly.\n\nAs the championship unfolds, the excitement and anticipation continue to build. Each race is a nail-biting experience, keeping fans on the edge of their seats. The stakes are high, and every moment is filled with drama and suspense. The atmosphere is electric, with cheers and applause echoing throughout the venue.', 3, true, '2025-01-10', '2025-03-01')
  ) AS v(AccountId, Title, Description, Image, Content, SortOrder, IsVisible, DateCreated, DateModified)
  CROSS JOIN all_organization o
  ON CONFLICT DO NOTHING
  RETURNING PostId, Title
),
all_post AS (
  SELECT PostId, Title FROM ins_post
  UNION
  SELECT PostId, Title FROM Post
)

-- Seed Event
, ins_event AS (
  INSERT INTO Event (Name, Description, DateStart, DateEnd, ExternalUrl, Image, IsVisible, SortOrder, DateCreated, DateModified, OrganizationId)
  SELECT v.Name, v.Description, v.DateStart, v.DateEnd, v.ExternalUrl, v.Image, v.IsVisible, v.SortOrder, v.DateCreated::timestamp, v.DateModified::timestamp, o.OrganizationId
  FROM (VALUES
    ('Trackmania World Championship 2025', 'The most prestigious Trackmania event of the year.', '2025-06-10'::timestamp, '2025-06-20'::timestamp, 'https://trackmania.io/world-championship-2025', 'assets/images/hds-events-nobg.png', true, 1, '2024-12-15', '2025-01-20'),
    ('Trackmania Summer League', 'A summer-long league for Trackmania enthusiasts.', '2025-07-01'::timestamp, '2025-08-31'::timestamp, 'https://trackmania.io/summer-league-2025', 'assets/images/holydynasty.png', true, 2, '2025-01-25', '2025-03-10')
  ) AS v(Name, Description, DateStart, DateEnd, ExternalUrl, Image, IsVisible, SortOrder, DateCreated, DateModified)
  CROSS JOIN all_organization o
  ON CONFLICT DO NOTHING
  RETURNING EventId, Name
),
all_event AS (
  SELECT EventId, Name FROM ins_event
  UNION
  SELECT EventId, Name FROM Event
)

-- Seed TeamRole (add OrganizationId)
, ins_teamrole AS (
  INSERT INTO TeamRole (Name, SortOrder, DateCreated, DateModified, OrganizationId)
  SELECT v.Name, v.SortOrder, v.DateCreated::timestamp, v.DateModified::timestamp, o.OrganizationId
  FROM (VALUES
    ('OWNER', 1, '2024-11-01', '2025-01-01'),
    ('COACH', 2, '2024-11-10', '2025-01-10'),
    ('CAPTAIN', 3, '2024-11-20', '2025-01-20'),
    ('PLAYER', 4, '2024-12-01', '2025-02-01'),
    ('SUBSTITUTE', 5, '2024-12-10', '2025-02-10'),
    ('CASTER', 6, '2024-12-20', '2025-02-20'),
    ('ADMIN', 7, '2025-01-01', '2025-03-01'),
    ('JUSTWORKSHERE', 8, '2025-01-10', '2025-03-10'),
    ('UNKNOWN', 9, '2025-01-20', '2025-03-20')
  ) AS v(Name, SortOrder, DateCreated, DateModified)
  CROSS JOIN all_organization o
  ON CONFLICT DO NOTHING
  RETURNING TeamRoleId, Name
),
all_teamrole AS (
  SELECT TeamRoleId, Name FROM ins_teamrole
  UNION
  SELECT TeamRoleId, Name FROM TeamRole
)

-- Seed TeamPlayer
, ins_teamplayer AS (
  INSERT INTO TeamPlayer (TeamId, AccountId, TeamRoleId, DateCreated, DateModified)
  SELECT t.TeamId, p.AccountId, r.TeamRoleId, v.DateCreated::timestamp, v.DateModified::timestamp
  FROM (VALUES
    (1, '794a286c-44d9-4276-83ce-431cba7bab74', 'PLAYER', '2024-11-15', '2025-01-10'),
    (1, '89894a9a-957c-4c88-8d88-3149283ca2bd', 'CAPTAIN', '2024-11-16', '2025-01-11'),
    (1, 'f5e37115-d85a-4f3e-bc5a-969d6e29fede', 'PLAYER', '2024-11-17', '2025-01-12'),
    (1, '83b5f677-3296-4d2a-ad6b-5a100565de22', 'PLAYER', '2024-11-18', '2025-01-13'),
    (1, 'b8c5c3a0-4cac-4eba-abd4-2f55afab04e2', 'PLAYER', '2024-11-19', '2025-01-14'),
    (1, '3d11c8f8-258b-433f-9395-7c6f42f7784e', 'PLAYER', '2024-11-20', '2025-01-15'),
    (2, '09747490-4eeb-410c-aa49-58ee38481760', 'PLAYER', '2024-12-01', '2025-02-01'),
    (2, 'fcad7ce0-49ac-4c56-ac19-ecfca890a451', 'COACH', '2024-12-02', '2025-02-02'),
    (2, 'a16a44f5-dc0-47e1-bf00-6174fec76bf1', 'PLAYER', '2024-12-03', '2025-02-03'),
    (2, '943245e6-cc01-40ec-80f9-77bb2cbb5914', 'PLAYER', '2024-12-04', '2025-02-04'),
    (2, 'd85fd2cc-bf6a-44a7-88cc-9d8695b82b88', 'PLAYER', '2024-12-05', '2025-02-05'),
    (2, '70d7c4d4-ff63-4579-9069-05eaf5e60399', 'PLAYER', '2024-12-06', '2025-02-06'),
    (3, 'a1accb5b-a4f1-43a7-ada7-119a890b12f1', 'PLAYER', '2025-01-05', '2025-03-05'),
    (3, 'dae72d20-d7d1-4908-ac8b-9ae1994cb3b4', 'SUBSTITUTE', '2025-01-06', '2025-03-06'),
    (3, '7886c8e0-902c-4b63-b9c4-59153d98aaaa', 'PLAYER', '2025-01-07', '2025-03-07'),
    (3, 'c7818ba0-5e85-408e-a852-f658e8b90eec', 'PLAYER', '2025-01-08', '2025-03-08'),
    (3, '6b9a48bf-a0b4-452a-9151-1e3b53133faf', 'PLAYER', '2025-01-09', '2025-03-09'),
    (3, '62687d40-1291-484b-be06-d6810bf78606', 'PLAYER', '2025-01-10', '2025-03-10'),
    (4, 'd2f9cf26-60c2-4e5e-8770-c1a78cad1124', 'PLAYER', '2025-01-20', '2025-04-01'),
    (4, 'f77223ad-cddc-466e-8680-38edc9057f2d', 'CASTER', '2025-01-21', '2025-04-02'),
    (4, '4d9676aa-4bd0-4120-b9e5-9b727b697108', 'PLAYER', '2025-01-22', '2025-04-03'),
    (4, '53d6f5df-7a48-437f-aa3c-ced48894826e', 'PLAYER', '2025-01-23', '2025-04-04'),
    (4, '7886c8e0-902c-4b63-b9c4-59153d98aaaa', 'PLAYER', '2025-01-24', '2025-04-05'),
    (4, 'b8c5c3a0-4cac-4eba-abd4-2f55afab04e2', 'PLAYER', '2025-01-25', '2025-04-06'),
    (5, '3da84e95-ec21-4635-bc0c-47dc0dbbc62c', 'PLAYER', '2025-02-10', '2025-05-01'),
    (5, '6e3bf3f9-7dcb-47d4-bdae-037ab66628f2', 'OWNER', '2025-02-11', '2025-05-02'),
    (5, '83b5f677-3296-4d2a-ad6b-5a100565de22', 'PLAYER', '2025-02-12', '2025-05-03'),
    (5, 'a6d27eb1-55ff-4c54-a8da-6fd5fb064f95', 'PLAYER', '2025-02-13', '2025-05-04'),
    (5, '09747490-4eeb-410c-aa49-58ee38481760', 'PLAYER', '2025-02-14', '2025-05-05'),
    (5, 'f5e37115-d85a-4f3e-bc5a-969d6e29fede', 'PLAYER', '2025-02-15', '2025-05-06')
  ) AS v(TeamNum, AccountId, RoleName, DateCreated, DateModified)
  JOIN all_team t ON t.TeamId = v.TeamNum
  JOIN all_player p ON p.AccountId = v.AccountId
  JOIN all_teamrole r ON r.Name = v.RoleName
  ON CONFLICT (TeamId, AccountId, TeamRoleId) DO NOTHING
  RETURNING TeamPlayerId, TeamId, AccountId
),
all_teamplayer AS (
  SELECT TeamPlayerId, TeamId, AccountId FROM ins_teamplayer
  UNION
  SELECT TeamPlayerId, TeamId, AccountId FROM TeamPlayer
)

-- Seed Tag (add OrganizationId)
, ins_tag AS (
  INSERT INTO Tag (Name, SortOrder, IsVisible, DateCreated, DateModified, OrganizationId)
  SELECT v.Name, v.SortOrder, v.IsVisible, v.DateCreated::timestamp, v.DateModified::timestamp, o.OrganizationId
  FROM (VALUES
    ('update', 1, true, '2024-11-05', '2025-01-05'),
    ('trackmania', 2, true, '2024-12-05', '2025-02-05'),
    ('tournament', 3, true, '2025-01-05', '2025-03-05'),
    ('championship', 4, true, '2025-02-05', '2025-04-05')
  ) AS v(Name, SortOrder, IsVisible, DateCreated, DateModified)
  CROSS JOIN all_organization o
  ON CONFLICT DO NOTHING
  RETURNING TagId, Name
),
all_tag AS (
  SELECT TagId, Name FROM ins_tag
  UNION
  SELECT TagId, Name FROM Tag
)

-- Seed PostTag (using IDs from all_post and all_tag)
, ins_posttag AS (
  INSERT INTO PostTag (PostId, TagId, SortOrder, IsVisible, DateCreated, DateModified)
  SELECT p.PostId, t.TagId, v.SortOrder, true, v.DateCreated::timestamp, v.DateModified::timestamp
  FROM (VALUES
    ('Trackmania Update', 'update', 1, '2024-11-21', '2025-01-16'),
    ('Trackmania Update', 'trackmania', 2, '2024-11-22', '2025-01-17'),
    ('Upcoming Tournament', 'tournament', 1, '2024-12-11', '2025-02-02'),
    ('Upcoming Tournament', 'trackmania', 2, '2024-12-12', '2025-02-03'),
    ('Trackmania Championship', 'championship', 1, '2025-01-11', '2025-03-02')
  ) AS v(Title, TagName, SortOrder, DateCreated, DateModified)
  JOIN all_post p ON p.Title = v.Title
  JOIN all_tag t ON t.Name = v.TagName
  ON CONFLICT (PostId, TagId) DO NOTHING
  RETURNING PostTagId
)

-- Seed EventPlayer
, ins_eventplayer1 AS (
  INSERT INTO EventPlayer (EventId, TeamPlayerId, EventRoleId, DateCreated, DateModified)
  SELECT e.EventId, tp.TeamPlayerId, 4, '2024-12-16'::timestamp, '2025-01-21'::timestamp
  FROM all_event e
  JOIN all_teamplayer tp ON tp.TeamPlayerId IN (1,2)
  WHERE e.Name = 'Trackmania World Championship 2025'
  ON CONFLICT (EventId, TeamPlayerId, EventRoleId) DO NOTHING
  RETURNING EventPlayerId
),
ins_eventplayer2 AS (
  INSERT INTO EventPlayer (EventId, TeamPlayerId, EventRoleId, DateCreated, DateModified)
  SELECT e.EventId, tp.TeamPlayerId, 4, '2025-01-26'::timestamp, '2025-03-11'::timestamp
  FROM all_event e
  JOIN all_teamplayer tp ON tp.TeamPlayerId IN (3,4)
  WHERE e.Name = 'Trackmania Summer League'
  ON CONFLICT (EventId, TeamPlayerId, EventRoleId) DO NOTHING
  RETURNING EventPlayerId
)
SELECT 1;
-- End of seed script

---- create above / drop below ----

DELETE FROM EventPlayer;
DELETE FROM PostTag;
DELETE FROM Tag;
DELETE FROM TeamPlayer;
DELETE FROM TeamRole;
DELETE FROM Event;
DELETE FROM Post;
DELETE FROM Team;
DELETE FROM Player;
