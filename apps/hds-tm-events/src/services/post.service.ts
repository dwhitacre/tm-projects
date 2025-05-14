import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { PostResponse } from 'src/domain/post'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _: HttpClient) {}

  getAll(): Observable<PostResponse> {
    return of({
      posts: [
        {
          id: '1',
          title: 'Trackmania Update',
          description:
            'The latest Trackmania update brings exciting new features, bug fixes, and performance improvements. Players can now enjoy a smoother gaming experience with enhanced graphics and gameplay mechanics. This update also includes new tracks and challenges to keep the community engaged.',
          image: 'assets/images/dotm.webp',
          content: `Trackmania has introduced a host of new features in its latest update. This marks a significant milestone for the community, as many long-awaited improvements have finally arrived. The development team has worked tirelessly to ensure a seamless experience for all players. Feedback from the community has been overwhelmingly positive, with many praising the attention to detail. The update is expected to set a new standard for future releases.

Players will notice significant improvements in the game’s performance, making it more enjoyable and accessible. The update also addresses several bugs that were reported by the community, ensuring a smoother experience for everyone. These fixes target both minor annoyances and major gameplay issues, resulting in a more stable environment. Many players have already commented on the reduced load times and increased frame rates. The technical team has published a detailed changelog to highlight all the improvements.

One of the highlights of this update is the addition of new tracks. These tracks are designed to challenge players’ skills and creativity, offering a fresh take on the classic Trackmania gameplay. The developers have also included new customization options, allowing players to personalize their vehicles and tracks. The new tracks feature unique obstacles and creative layouts, pushing the boundaries of what’s possible in the game. Customization now extends to decals, paint jobs, and even sound effects. Players can share their creations with the community, fostering a sense of collaboration.

In addition to these features, the update brings enhanced graphics that make the game more visually appealing. The lighting and textures have been improved, creating a more immersive environment. Players can also look forward to new events and competitions that will be hosted in the coming weeks. The visual overhaul includes dynamic weather effects and improved reflections, making every race feel more lifelike. Upcoming competitions promise exclusive rewards and fierce rivalries. The graphics team has worked closely with artists to ensure a cohesive look and feel.

The community has already started exploring the new features, sharing their experiences and feedback. This update is a testament to the developers’ commitment to continuously improving the game. Social media is abuzz with clips of impressive stunts and creative track designs. The feedback loop between players and developers has never been stronger, ensuring that future updates will be even more tailored to the community’s needs. Community-driven events are being planned to celebrate the update.

Overall, the latest Trackmania update is a must-try for both new and veteran players. It sets the stage for an exciting future for the game, with more updates and features expected in the coming months. The sense of anticipation is palpable, as players speculate about what’s next. Whether you’re a casual racer or a competitive pro, there’s something in this update for everyone. The developers have promised to keep listening to feedback and making improvements.

The update also introduces a new ranking system, allowing players to track their progress and compete with others on a global scale. This feature has been highly requested by the community and adds a new layer of excitement to the game. The ranking system includes seasonal resets and special badges for top performers, encouraging players to keep improving. Leaderboards are now more accessible and provide detailed statistics. Players can compare their progress with friends and rivals alike.

In conclusion, the latest Trackmania update is a comprehensive package that caters to both casual and competitive players. It’s a testament to the developers’ dedication to creating a game that is both fun and challenging. The future looks bright for Trackmania, and the community can look forward to even more innovations in the months ahead. The update has set a new benchmark for quality and engagement. Players are already looking forward to the next big announcement.

Moreover, the update has brought a new level of accessibility to the game. Players with different skill levels can now find modes and challenges that suit their preferences. This inclusivity has been widely appreciated by the community. Tutorials and onboarding have been revamped, making it easier for newcomers to get started. Accessibility options have been expanded to accommodate a wider range of players.

The developers have also introduced seasonal events that will keep the game fresh and engaging. These events are designed to bring the community together, fostering a sense of camaraderie and competition. Special event tracks and limited-time challenges will keep players coming back for more. Rewards for participation include unique cosmetics and in-game currency. The event calendar is packed with exciting activities for all.

The update has also focused on enhancing the game’s audio experience. From the roar of engines to the ambient sounds of the tracks, every detail has been fine-tuned to create an immersive experience. New soundtracks and effects add depth to the gameplay, making each race a sensory delight. The audio team collaborated with musicians to create a memorable score. Players can now customize their in-game audio settings for a personalized experience.

In addition, the update has expanded the game’s lore, providing players with a deeper understanding of the Trackmania universe. This narrative element adds a new dimension to the game, making it more engaging and memorable. Story-driven events and character backstories are now part of the experience. Players can unlock lore entries by completing specific challenges. The lore has sparked discussions and theories within the community.

Finally, the update has set the stage for future expansions and features. The developers have hinted at exciting new content that will be unveiled in the coming months. This forward-looking approach ensures that Trackmania will continue to evolve and captivate its audience. The roadmap includes new game modes, cross-platform play, and more community-driven content. Players are encouraged to submit their ideas for future updates.`,
          tags: ['update', 'trackmania'],
          author: {
            accountId: '12345',
            name: 'PlayerOne',
            image: 'assets/images/airky.png',
            discord: 'PlayerOne#1234',
            twitch: 'playerone_twitch',
          },
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          visible: true,
          sortOrder: 1,
        },
        {
          id: '2',
          title: 'Upcoming Tournament',
          description:
            'Get ready for the upcoming Trackmania tournament, featuring top players from around the world. This event promises intense competition, thrilling races, and a showcase of incredible skills. Don’t miss the chance to witness history in the making.',
          image: 'assets/images/hds-events-bg.png',
          content: `The upcoming Trackmania tournament is set to be one of the most exciting events of the year. Anticipation is building as players from around the world prepare to compete. Organizers have promised a spectacle that will be remembered for years to come. The event is expected to draw record-breaking crowds and online viewership. Preparations are underway to ensure a flawless experience for all participants.

Players from all over the globe will compete for the championship title, showcasing their skills and strategies. The tournament will feature a series of challenging tracks, designed to test the limits of even the most experienced players. Each track has been meticulously crafted to provide a unique challenge, ensuring that no two races are alike. Competitors are already strategizing and practicing to gain an edge. The stakes are higher than ever, with substantial prizes on the line.

Spectators can look forward to thrilling races, as competitors push their vehicles to the limit. The event will also include live commentary, providing insights into the strategies and techniques used by the players. Fans will be able to interact with commentators and participate in live polls, adding an extra layer of excitement to the viewing experience. Special camera angles and instant replays will enhance the broadcast. The energy in the arena is expected to be electric.

In addition to the main competition, there will be side events and activities for attendees. These include meet-and-greets with top players, workshops on improving gameplay, and opportunities to try out the latest Trackmania features. Attendees can also participate in mini-tournaments and win exclusive prizes. The event will feature food stalls, merchandise booths, and interactive exhibits. There will be something for everyone, regardless of skill level.

The tournament is not just about competition; it’s also a celebration of the Trackmania community. Fans and players will come together to share their passion for the game, creating an unforgettable experience. Community booths and fan art displays will showcase the creativity and enthusiasm of Trackmania’s player base. The event will foster new friendships and strengthen existing bonds. Organizers hope to make this an annual tradition.

Whether you’re a seasoned player or a newcomer to Trackmania, this tournament is an event you won’t want to miss. Mark your calendars and get ready for an action-packed weekend. The event promises something for everyone, from high-stakes races to casual fun. There will be opportunities to learn from the best and improve your skills. The memories made here will last a lifetime.

The event organizers have also planned a series of giveaways and contests for attendees. These activities are designed to engage the community and add an extra layer of excitement to the event. Prizes include rare in-game items, merchandise, and even opportunities to race against the pros. Winners will be announced throughout the event, keeping the excitement high. Participation is encouraged for all attendees.

For those unable to attend in person, the tournament will be live-streamed on various platforms. This ensures that fans from around the world can join in on the action and cheer for their favorite players. Interactive chat and real-time stats will make the online experience just as engaging as being there in person. The production team is working hard to deliver a seamless broadcast. Fans can expect behind-the-scenes content and interviews.

The tournament venue has been carefully selected to provide the best possible experience for both players and spectators. With state-of-the-art facilities and a vibrant atmosphere, it’s the perfect setting for this prestigious event. The venue will also feature food trucks, entertainment zones, and relaxation areas. Accessibility has been prioritized to ensure everyone can enjoy the event. Security measures are in place for a safe experience.

As the tournament date approaches, the excitement continues to build. Players are busy preparing and strategizing, while fans eagerly await the chance to witness history in the making. Social media is buzzing with predictions and friendly rivalries. The countdown to the big day has begun, and anticipation is at an all-time high. Organizers are providing regular updates to keep everyone informed.

In conclusion, the upcoming Trackmania tournament is more than just a competition; it’s a celebration of the game and its community. Don’t miss out on this incredible event. The memories made here will last a lifetime. Organizers are already planning future tournaments based on the success of this one. The legacy of this event will inspire future generations of players.`,
          tags: ['tournament', 'trackmania'],
          author: {
            accountId: '67890',
            name: 'PlayerTwo',
            image: 'assets/images/halcyon.png',
            discord: 'PlayerTwo#5678',
            twitch: 'playertwo_twitch',
          },
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          visible: true,
          sortOrder: 2,
        },
        {
          id: '3',
          title: 'Trackmania Championship',
          description:
            'The Trackmania Championship is the ultimate test of skill and endurance. Compete with the best players in the world and prove your mettle. This championship is a celebration of the game’s competitive spirit and community.',
          image: 'assets/images/holydynasty.png',
          content: `The Trackmania Championship is an event that every fan of the game looks forward to. The anticipation is palpable as the best players from around the world prepare to compete for glory. The event has been months in the making, with organizers sparing no effort to ensure its success. Fans have been eagerly discussing their favorite competitors and potential outcomes. The championship is expected to set new records for participation and viewership.

It brings together the best players from around the world, competing for the prestigious title. The championship features a series of grueling tracks, each designed to test different aspects of a player’s skill. The diversity of tracks ensures that only the most versatile and skilled racers will prevail. Each race is a showcase of talent, determination, and strategy. The pressure is immense, but the rewards are even greater.

From high-speed straights to intricate technical sections, the tracks are a true test of endurance and precision. Players must navigate these challenges while maintaining their composure under pressure. The margin for error is razor-thin, and every second counts. Spectators are treated to breathtaking displays of skill and daring maneuvers. The excitement is contagious, spreading throughout the audience.

The event is not just about the competition; it’s also a celebration of the Trackmania community. Fans gather to cheer for their favorite players, creating an electric atmosphere. The championship also includes live broadcasts, allowing fans from around the world to join in the excitement. Special guest commentators and analysts will provide expert insights throughout the event. The sense of unity and shared passion is evident in every interaction.

In addition to the main event, there are side activities and exhibitions. These include showcases of new Trackmania content, opportunities to meet the developers, and interactive sessions with top players. Attendees can participate in Q&A sessions, try out unreleased features, and collect exclusive memorabilia. The exhibition hall is filled with excitement and discovery. Fans can connect with their idols and learn from the best.

The Trackmania Championship is more than just a competition; it’s a testament to the passion and dedication of the community. It’s an event that inspires players and fans alike, setting the stage for the future of the game. The sense of unity and excitement is unmatched. The championship has become a symbol of excellence and achievement in the Trackmania world.

The championship also serves as a platform for players to showcase their creativity and innovation. From unique track designs to innovative strategies, the event highlights the best of what the community has to offer. Creative competitions and fan-voted awards will recognize outstanding contributions. The spirit of innovation is alive and well, driving the game forward.

For newcomers, the championship is an opportunity to learn from the best. Watching top players in action provides valuable insights and inspiration for improving their own gameplay. Tutorials and analysis segments will help viewers understand the finer points of competitive racing. The learning opportunities are endless, both for players and fans.

The event organizers have gone to great lengths to ensure a seamless experience for everyone involved. From state-of-the-art facilities to a well-planned schedule, every detail has been carefully considered. Attendees will enjoy comfortable seating, high-quality streaming, and a welcoming environment. The logistics team has worked tirelessly to ensure everything runs smoothly.

As the championship unfolds, the excitement and anticipation continue to build. Each race is a nail-biting experience, keeping fans on the edge of their seats. The stakes are high, and every moment is filled with drama and suspense. The atmosphere is electric, with cheers and applause echoing throughout the venue.

In summary, the Trackmania Championship is a celebration of skill, passion, and community. It’s an event that brings people together and showcases the very best of what Trackmania has to offer. The legacy of this championship will inspire future generations of players. The memories created here will last a lifetime.`,
          tags: ['championship', 'trackmania'],
          author: {
            accountId: '11223',
            name: 'PlayerThree',
            image: 'assets/images/pikachu.jpg',
            discord: 'PlayerThree#1122',
            twitch: 'playerthree_twitch',
          },
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          visible: true,
          sortOrder: 3,
        },
        {
          id: '4',
          title: 'New Track Release',
          description:
            'Explore the newly released Trackmania tracks, designed to challenge and excite. These tracks offer a fresh experience, combining creativity and technicality. Perfect for players looking to test their skills and have fun.',
          image: 'assets/images/quagsire-pokemon.png',
          content: `The latest Trackmania tracks are here, and they’re better than ever. The excitement among players is palpable as they dive into these new challenges. The launch event was met with great enthusiasm, drawing players from all corners of the globe. Early reviews have praised the creativity and technical prowess on display. The new tracks are already being hailed as some of the best in the series.

These tracks are a testament to the creativity and ingenuity of the developers, offering a unique experience for players. Each track has been designed with meticulous attention to detail, ensuring a fresh and engaging experience every time. The design team spent months perfecting every curve and obstacle. Playtesting sessions helped refine the tracks for maximum enjoyment. The end result is a collection of tracks that challenge and delight in equal measure.

Each track is designed to challenge different aspects of gameplay, from speed and precision to strategy and adaptability. Players will need to bring their A-game to conquer these new challenges. The variety of obstacles and layouts means that no two races are ever the same. Advanced players will appreciate the subtle nuances and hidden shortcuts. Beginners will find plenty of opportunities to learn and improve.

The tracks also feature stunning visuals, with intricate designs and vibrant colors. They are a feast for the eyes, making the gameplay experience even more enjoyable. Dynamic lighting and weather effects add to the immersion, making every race feel unique. The visual presentation has set a new benchmark for the series. Players have been sharing screenshots and videos to showcase the beauty of the new tracks.

In addition to the tracks, the update includes new customization options. Players can personalize their vehicles and tracks, adding a personal touch to their gameplay. Customization options now include new skins, decals, and even custom soundtracks. The customization menu has been revamped for easier navigation. Players can now save and share their favorite setups with friends.

Whether you’re a competitive player or someone who enjoys casual gaming, these new tracks have something for everyone. Dive in and explore the world of Trackmania like never before. The sense of discovery and accomplishment is stronger than ever. Community challenges and leaderboards add an extra layer of excitement. The update has breathed new life into the game.

The developers have also included new multiplayer challenges, encouraging players to team up and compete against others. These challenges add a new layer of excitement to the game. Cooperative and competitive modes ensure that everyone can find their preferred playstyle. Special events and tournaments are planned throughout the season. The multiplayer experience is more robust and rewarding than ever.

The update has been well-received by the community, with players praising the quality and creativity of the new tracks. Social media is abuzz with discussions and reviews, highlighting the best aspects of the update. Community tournaments and leaderboards are already showcasing the top performers. The positive feedback has encouraged the developers to keep innovating. The future looks bright for Trackmania fans.

For those looking to improve their skills, the new tracks offer an excellent opportunity to practice and refine their techniques. Each track is a learning experience, helping players grow and evolve. Training modes and ghost races provide valuable feedback and motivation. The community has created guides and tutorials to help newcomers. Improvement is both accessible and rewarding.

The developers have promised to continue adding new content and features, ensuring that the game remains fresh and engaging. This commitment to innovation is what sets Trackmania apart. The roadmap includes even more tracks, features, and community-driven events. Players can look forward to regular updates and surprises. The journey is just beginning for Trackmania enthusiasts.`,
          tags: ['tracks', 'release'],
          author: {
            accountId: '44556',
            name: 'PlayerFour',
            image: 'assets/images/stare-emote.webp',
            discord: 'PlayerFour#4455',
            twitch: 'playerfour_twitch',
          },
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          visible: true,
          sortOrder: 4,
        },
        ...Array.from({ length: 28 }, (_, i) => ({
          id: `${i + 5}`,
          title: `Generated Post ${i + 5}`,
          description: `This is a detailed description for post ${i + 5}, providing insights and highlights about the content. It aims to engage the reader and offer a glimpse into the exciting details of the post.`,
          image: `assets/images/hds-events-nobg.png`,
          content: `Content for post ${i + 5} is expansive and detailed, covering various aspects of the topic. Each paragraph delves into specific points, offering a comprehensive view. The introduction sets the tone, providing background and context for the discussion. Readers are encouraged to consider the broader implications and connections to related topics. This opening not only welcomes the reader but also establishes the importance of the subject matter, ensuring that everyone is on the same page. The introduction also hints at the structure of the post, preparing the audience for what is to come.

The first paragraph introduces the topic, setting the stage for the discussion. It outlines the main themes and objectives, ensuring that readers know what to expect. The paragraph also highlights the importance of the subject and its relevance to the community. By establishing a clear focus, it helps guide the reader through the rest of the content. The introduction concludes with a call to engage and reflect on the material presented. Additionally, it encourages readers to think critically about the information and to consider how it might apply to their own experiences or interests.

Subsequent paragraphs explore different angles, providing depth and context. They examine the topic from multiple perspectives, incorporating examples and real-world applications. Each point is supported by evidence or logical reasoning, making the arguments compelling and easy to follow. The writing style remains accessible, ensuring that both newcomers and experienced readers can benefit. These sections encourage critical thinking and invite further exploration. The discussion is enriched by anecdotes and case studies, which help to illustrate the key points and make the content more relatable.

The content is designed to be engaging and informative, keeping the reader hooked. It balances technical details with accessible language, making it suitable for a wide audience. Anecdotes and case studies are used to illustrate key concepts, adding a personal touch to the narrative. The author anticipates potential questions and addresses them proactively, fostering a sense of dialogue. This approach helps maintain interest and encourages readers to continue learning. The narrative is punctuated with thought-provoking questions and suggestions for further reading, ensuring that the learning process does not end with the post itself.

Each section builds on the previous one, creating a cohesive narrative. Transitions are smooth, guiding the reader seamlessly from one idea to the next. The structure ensures that information is presented logically, making it easy to understand and retain. By the end of the section, readers have a comprehensive understanding of the topic and its significance. The narrative flow keeps the content engaging from start to finish. The careful organization of ideas allows readers to follow the argument effortlessly, and the use of summaries at the end of each section reinforces the main points.

The final paragraph ties everything together, leaving the reader with a clear understanding of the topic. It summarizes the main points and reiterates their importance, reinforcing the key takeaways. The conclusion also suggests avenues for further study or action, encouraging readers to apply what they have learned. By ending on a thoughtful note, the content leaves a lasting impression. Readers are invited to share their thoughts and continue the conversation. The closing remarks also provide a sense of closure, while simultaneously opening the door to new questions and future discussions.

Overall, the content is a valuable resource for anyone interested in the subject, offering both knowledge and entertainment. It serves as a reference for future discussions and inspires readers to delve deeper into related topics. The comprehensive coverage ensures that all major aspects are addressed, providing a well-rounded perspective. Whether for personal growth or professional development, this post offers something for everyone. The engaging style and thorough analysis make it a standout contribution to the ongoing dialogue. The post ultimately aims to foster a vibrant and informed community, where ideas can be exchanged freely and constructively.`,
          tags: ['generated', 'post'],
          author: {
            accountId: `${i + 10000}`,
            name: `GeneratedPlayer${i + 5}`,
            image: `assets/images/USA.jpg`,
            discord: `GeneratedPlayer${i + 5}#${i + 1000}`,
            twitch: `generatedplayer${i + 5}_twitch`,
          },
          dateCreated: new Date('2025-01-01'),
          dateModified: new Date('2025-05-01'),
          visible: true,
          sortOrder: i + 5,
        })),
      ],
    })
  }
}
