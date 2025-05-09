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
          title: 'Trackmania Update',
          description: 'Details about the latest Trackmania update.',
          image: 'assets/images/image1.jpg',
          content: 'Trackmania has introduced new features and bug fixes.',
          tags: ['update', 'trackmania'],
          author: {
            accountId: '12345',
            name: 'PlayerOne',
            image: 'assets/images/player1.jpg',
            discord: 'PlayerOne#1234',
            twitch: 'playerone_twitch',
          },
          dateCreated: new Date(),
          dateModified: new Date(),
          visible: true,
          sortOrder: 1,
        },
        {
          title: 'Upcoming Tournament',
          description: 'Join the upcoming Trackmania tournament.',
          image: 'assets/images/image2.jpg',
          content: 'The tournament will feature top players from around the world.',
          tags: ['tournament', 'trackmania'],
          author: {
            accountId: '67890',
            name: 'PlayerTwo',
            image: 'assets/images/player2.jpg',
            discord: 'PlayerTwo#5678',
            twitch: 'playertwo_twitch',
          },
          dateCreated: new Date(),
          dateModified: new Date(),
          visible: true,
          sortOrder: 2,
        },
        {
          title: 'Trackmania Championship',
          description: 'The biggest Trackmania championship of the year.',
          image: 'assets/images/image3.jpg',
          content: 'Compete with the best players in the world.',
          tags: ['championship', 'trackmania'],
          author: {
            accountId: '11223',
            name: 'PlayerThree',
            image: 'assets/images/player3.jpg',
            discord: 'PlayerThree#1122',
            twitch: 'playerthree_twitch',
          },
          dateCreated: new Date(),
          dateModified: new Date(),
          visible: true,
          sortOrder: 3,
        },
        {
          title: 'New Track Release',
          description: 'Explore the newly released Trackmania tracks.',
          image: 'assets/images/image4.jpg',
          content: 'These tracks are designed to challenge your skills.',
          tags: ['tracks', 'release'],
          author: {
            accountId: '44556',
            name: 'PlayerFour',
            image: 'assets/images/player4.jpg',
            discord: 'PlayerFour#4455',
            twitch: 'playerfour_twitch',
          },
          dateCreated: new Date(),
          dateModified: new Date(),
          visible: true,
          sortOrder: 4,
        },
        ...Array.from({ length: 28 }, (_, i) => ({
          title: `Generated Post ${i + 5}`,
          description: `This is a description for post ${i + 5}.`,
          image: `assets/images/image${i + 5}.jpg`,
          content: `Content for post ${i + 5}.`,
          tags: ['generated', 'post'],
          author: {
            accountId: `${i + 10000}`,
            name: `GeneratedPlayer${i + 5}`,
            image: `assets/images/player${i + 5}.jpg`,
            discord: `GeneratedPlayer${i + 5}#${i + 1000}`,
            twitch: `generatedplayer${i + 5}_twitch`,
          },
          dateCreated: new Date(),
          dateModified: new Date(),
          visible: true,
          sortOrder: i + 5,
        })),
      ],
    })
  }
}
