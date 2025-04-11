import type { IPlayer } from "../domain/player";
import { Repository, type RepositoryOptions } from "./repository";

export class PlayerOverridesRepository extends Repository {
  constructor(options: Partial<RepositoryOptions>) {
    super(options);
  }

  insert(
    accountId: IPlayer["accountId"],
    name: IPlayer["name"],
    image: IPlayer["image"],
    twitch: IPlayer["twitch"],
    discord: IPlayer["discord"]
  ) {
    return this.db.insert(
      `
        insert into PlayerOverrides(AccountId, Name, Image, Twitch, Discord)
        values ($1, $2, $3, $4, $5)
      `,
      [accountId, name, image, twitch, discord]
    );
  }
}
