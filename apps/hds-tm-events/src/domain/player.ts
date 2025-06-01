export interface Player {
  accountId: string
  name: string
  image: string
  twitch: string
  discord: string
}

export type PlayerResponse = Array<Player>
