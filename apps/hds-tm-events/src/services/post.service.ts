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
          content:
            'Trackmania has introduced a host of new features in its latest update. Players will notice significant improvements in the game’s performance, making it more enjoyable and accessible. The update also addresses several bugs that were reported by the community, ensuring a smoother experience for everyone.\n\nOne of the highlights of this update is the addition of new tracks. These tracks are designed to challenge players’ skills and creativity, offering a fresh take on the classic Trackmania gameplay. The developers have also included new customization options, allowing players to personalize their vehicles and tracks.\n\nIn addition to these features, the update brings enhanced graphics that make the game more visually appealing. The lighting and textures have been improved, creating a more immersive environment. Players can also look forward to new events and competitions that will be hosted in the coming weeks.\n\nThe community has already started exploring the new features, sharing their experiences and feedback. This update is a testament to the developers’ commitment to continuously improving the game.\n\nOverall, the latest Trackmania update is a must-try for both new and veteran players. It sets the stage for an exciting future for the game, with more updates and features expected in the coming months.\n\nThe developers have also focused on improving the user interface, making it more intuitive and user-friendly. This ensures that players can easily navigate through the game and access all the new features.\n\nAnother exciting addition is the introduction of new multiplayer modes. These modes are designed to foster collaboration and competition among players, enhancing the social aspect of the game.\n\nThe update also includes a revamped tutorial system, making it easier for new players to get started. This ensures that everyone, regardless of their experience level, can enjoy the game.\n\nFinally, the developers have promised to continue listening to community feedback and rolling out updates to address any issues. This commitment to continuous improvement is what makes Trackmania a standout game.\n\nThe update also introduces a new ranking system, allowing players to track their progress and compete with others on a global scale. This feature has been highly requested by the community and adds a new layer of excitement to the game.\n\nIn conclusion, the latest Trackmania update is a comprehensive package that caters to both casual and competitive players. It’s a testament to the developers’ dedication to creating a game that is both fun and challenging.\n\nMoreover, the update has brought a new level of accessibility to the game. Players with different skill levels can now find modes and challenges that suit their preferences. This inclusivity has been widely appreciated by the community.\n\nThe developers have also introduced seasonal events that will keep the game fresh and engaging. These events are designed to bring the community together, fostering a sense of camaraderie and competition.\n\nThe update has also focused on enhancing the game’s audio experience. From the roar of engines to the ambient sounds of the tracks, every detail has been fine-tuned to create an immersive experience.\n\nIn addition, the update has expanded the game’s lore, providing players with a deeper understanding of the Trackmania universe. This narrative element adds a new dimension to the game, making it more engaging and memorable.\n\nFinally, the update has set the stage for future expansions and features. The developers have hinted at exciting new content that will be unveiled in the coming months. This forward-looking approach ensures that Trackmania will continue to evolve and captivate its audience.\n\nThe update also includes a new feature called "Track Builder Pro," which allows players to create highly detailed and complex tracks. This tool has been praised for its user-friendly interface and powerful capabilities.\n\nPlayers can now share their custom tracks with the community, fostering creativity and collaboration. The Track Builder Pro has already led to the creation of some truly innovative and challenging tracks.\n\nAnother highlight of the update is the introduction of "Dynamic Weather Conditions." This feature adds a new layer of realism to the game, with weather conditions such as rain, fog, and snow affecting gameplay.\n\nThe developers have also added a "Replay Editor," enabling players to create cinematic replays of their races. This tool has been widely used by the community to showcase their skills and create stunning videos.\n\nThe update has also focused on improving the game’s physics engine, making the driving experience more realistic and enjoyable. Players have noted the improved handling and responsiveness of their vehicles.\n\nIn addition, the update includes a new "Career Mode," which allows players to progress through a series of challenges and unlock rewards. This mode has been praised for its engaging and rewarding gameplay.\n\nThe developers have also introduced a "Spectator Mode," enabling players to watch live races and learn from the best. This feature has been a hit among the community, with many using it to improve their skills.\n\nThe update has also brought new customization options, allowing players to personalize their vehicles and tracks. From custom paint jobs to unique track elements, the possibilities are endless.\n\nFinally, the update has set the stage for future esports events, with the developers announcing plans for a global Trackmania championship. This event is expected to attract the best players from around the world and showcase the game’s competitive potential.\n\nThe update also delves into the history of Trackmania, celebrating its legacy and evolution over the years. Players can explore a timeline of key milestones, from the game’s inception to its current state.\n\nIn addition, the update includes a series of developer diaries, offering insights into the creative process behind the game. These diaries provide a behind-the-scenes look at the challenges and triumphs of game development.\n\nThe update also introduces a new "Community Spotlight" feature, highlighting the contributions of players who have made a significant impact on the game. From track creators to esports champions, these individuals are celebrated for their dedication and talent.\n\nThe update also includes a "Photo Mode," allowing players to capture stunning images of their races and tracks. This feature has been widely praised for its versatility and ease of use.\n\nFinally, the update sets the stage for a new era of Trackmania, with the developers promising to continue pushing the boundaries of what the game can achieve. From innovative gameplay mechanics to groundbreaking features, the future of Trackmania looks brighter than ever.',
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
          content:
            'The upcoming Trackmania tournament is set to be one of the most exciting events of the year. Players from all over the globe will compete for the championship title, showcasing their skills and strategies. The tournament will feature a series of challenging tracks, designed to test the limits of even the most experienced players.\n\nSpectators can look forward to thrilling races, as competitors push their vehicles to the limit. The event will also include live commentary, providing insights into the strategies and techniques used by the players.\n\nIn addition to the main competition, there will be side events and activities for attendees. These include meet-and-greets with top players, workshops on improving gameplay, and opportunities to try out the latest Trackmania features.\n\nThe tournament is not just about competition; it’s also a celebration of the Trackmania community. Fans and players will come together to share their passion for the game, creating an unforgettable experience.\n\nWhether you’re a seasoned player or a newcomer to Trackmania, this tournament is an event you won’t want to miss. Mark your calendars and get ready for an action-packed weekend.\n\nThe event organizers have also planned a series of giveaways and contests for attendees. These activities are designed to engage the community and add an extra layer of excitement to the event.\n\nFor those unable to attend in person, the tournament will be live-streamed on various platforms. This ensures that fans from around the world can join in on the action and cheer for their favorite players.\n\nThe tournament venue has been carefully selected to provide the best possible experience for both players and spectators. With state-of-the-art facilities and a vibrant atmosphere, it’s the perfect setting for this prestigious event.\n\nAs the tournament date approaches, the excitement continues to build. Players are busy preparing and strategizing, while fans eagerly await the chance to witness history in the making.\n\nIn conclusion, the upcoming Trackmania tournament is more than just a competition; it’s a celebration of the game and its community. Don’t miss out on this incredible event.\n\nThe tournament will also feature exclusive merchandise for fans, including limited-edition items that commemorate the event. These collectibles are a must-have for any Trackmania enthusiast.\n\nFinally, the tournament serves as a platform to highlight the talent and dedication of the players. It’s an opportunity to celebrate their achievements and inspire the next generation of Trackmania champions.\n\nThe event will also include a special segment dedicated to the history of Trackmania tournaments. This retrospective will showcase memorable moments and highlight the evolution of the game’s competitive scene.\n\nIn addition, the tournament will feature a charity drive, encouraging the community to come together for a good cause. This initiative reflects the spirit of camaraderie and generosity that defines the Trackmania community.\n\nThe tournament will also introduce a new format that promises to make the competition even more thrilling. This innovative approach is designed to keep both players and spectators on the edge of their seats.\n\nFinally, the tournament will serve as a launchpad for new Trackmania content. Attendees will get an exclusive first look at upcoming features and updates, adding an extra layer of excitement to the event.',
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
          content:
            'The Trackmania Championship is an event that every fan of the game looks forward to. It brings together the best players from around the world, competing for the prestigious title. The championship features a series of grueling tracks, each designed to test different aspects of a player’s skill.\n\nFrom high-speed straights to intricate technical sections, the tracks are a true test of endurance and precision. Players must navigate these challenges while maintaining their composure under pressure.\n\nThe event is not just about the competition; it’s also a celebration of the Trackmania community. Fans gather to cheer for their favorite players, creating an electric atmosphere. The championship also includes live broadcasts, allowing fans from around the world to join in the excitement.\n\nIn addition to the main event, there are side activities and exhibitions. These include showcases of new Trackmania content, opportunities to meet the developers, and interactive sessions with top players.\n\nThe Trackmania Championship is more than just a competition; it’s a testament to the passion and dedication of the community. It’s an event that inspires players and fans alike, setting the stage for the future of the game.\n\nThe championship also serves as a platform for players to showcase their creativity and innovation. From unique track designs to innovative strategies, the event highlights the best of what the community has to offer.\n\nFor newcomers, the championship is an opportunity to learn from the best. Watching top players in action provides valuable insights and inspiration for improving their own gameplay.\n\nThe event organizers have gone to great lengths to ensure a seamless experience for everyone involved. From state-of-the-art facilities to a well-planned schedule, every detail has been carefully considered.\n\nAs the championship unfolds, the excitement and anticipation continue to build. Each race is a nail-biting experience, keeping fans on the edge of their seats.\n\nIn summary, the Trackmania Championship is a celebration of skill, passion, and community. It’s an event that brings people together and showcases the very best of what Trackmania has to offer.\n\nThe championship also includes a special segment dedicated to the history of Trackmania. This retrospective highlights the game’s evolution and the milestones that have defined its competitive scene.\n\nIn addition, the championship will feature exclusive interviews with top players, providing insights into their strategies and experiences. These interviews are a valuable resource for aspiring players looking to improve their skills.\n\nThe event will also include a showcase of new Trackmania content, giving attendees a first look at upcoming features and updates. This adds an extra layer of excitement to the championship.\n\nFinally, the championship serves as a platform to celebrate the achievements of the Trackmania community. From innovative track designs to groundbreaking strategies, the event highlights the creativity and dedication of its players.\n\nThe Trackmania Championship is more than just a competition; it’s a celebration of the game and its community. It’s an event that brings people together, inspires new ideas, and sets the stage for the future of Trackmania.',
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
          content:
            'The latest Trackmania tracks are here, and they’re better than ever. These tracks are a testament to the creativity and ingenuity of the developers, offering a unique experience for players.\n\nEach track is designed to challenge different aspects of gameplay, from speed and precision to strategy and adaptability. Players will need to bring their A-game to conquer these new challenges.\n\nThe tracks also feature stunning visuals, with intricate designs and vibrant colors. They are a feast for the eyes, making the gameplay experience even more enjoyable.\n\nIn addition to the tracks, the update includes new customization options. Players can personalize their vehicles and tracks, adding a personal touch to their gameplay.\n\nWhether you’re a competitive player or someone who enjoys casual gaming, these new tracks have something for everyone. Dive in and explore the world of Trackmania like never before.\n\nThe developers have also included new multiplayer challenges, encouraging players to team up and compete against others. These challenges add a new layer of excitement to the game.\n\nThe update has been well-received by the community, with players praising the quality and creativity of the new tracks. Social media is abuzz with discussions and reviews, highlighting the best aspects of the update.\n\nFor those looking to improve their skills, the new tracks offer an excellent opportunity to practice and refine their techniques. Each track is a learning experience, helping players grow and evolve.\n\nThe developers have promised to continue adding new content and features, ensuring that the game remains fresh and engaging. This commitment to innovation is what sets Trackmania apart.\n\nIn conclusion, the new Trackmania tracks are a must-try for anyone who loves the game. They offer a perfect blend of challenge, creativity, and fun, making them a valuable addition to the Trackmania experience.\n\nThe tracks also include hidden Easter eggs, adding an element of surprise and discovery for players. These secrets are a fun way to engage the community and encourage exploration.\n\nIn addition, the update introduces new tools for track creation, empowering players to design their own unique challenges. These tools are user-friendly and versatile, making them accessible to both beginners and experienced creators.\n\nThe new tracks also feature dynamic weather conditions, adding an extra layer of complexity to the gameplay. From rain-soaked roads to foggy landscapes, these conditions test players’ adaptability and skill.\n\nFinally, the update includes a series of community events centered around the new tracks. These events are designed to bring players together, fostering a sense of camaraderie and competition.\n\nThe new Trackmania tracks are more than just a gameplay update; they’re a celebration of the game’s creativity and community. They offer endless possibilities for fun, challenge, and innovation, making them a must-try for every Trackmania fan.',
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
          content: `Content for post ${i + 5} is expansive and detailed, covering various aspects of the topic. Each paragraph delves into specific points, offering a comprehensive view.\n\nThe first paragraph introduces the topic, setting the stage for the discussion. Subsequent paragraphs explore different angles, providing depth and context.\n\nThe content is designed to be engaging and informative, keeping the reader hooked. It balances technical details with accessible language, making it suitable for a wide audience.\n\nEach section builds on the previous one, creating a cohesive narrative. The final paragraph ties everything together, leaving the reader with a clear understanding of the topic.\n\nOverall, the content is a valuable resource for anyone interested in the subject, offering both knowledge and entertainment.`,
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
