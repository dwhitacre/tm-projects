import { Player, type IPlayer } from "../domain/player";
import { Repository, type RepositoryOptions } from "./repository";

export class PlayerRepository extends Repository {
  constructor(options: Partial<RepositoryOptions>) {
    super(options);
  }

  async get(accountId: IPlayer["accountId"]) {
    const result = await this.db.selectOne(
      `
        select * from Players
        where AccountId=$1
      `,
      [accountId]
    );
    return result ? Player.fromJson(result) : undefined;
  }

  async insert(player: IPlayer) {
    return this.db.insert(
      `
        insert into Players (AccountId, Name, Color, DisplayName)
        values ($1, $2, $3, $4)
      `,
      [player.accountId, player.name, player.color, player.displayName]
    );
  }

  async update(player: IPlayer) {
    return this.db.update(
      `
        update Players
        set Name=$2, Color=$3, DisplayName=$4, DateModified=now()
        where AccountId=$1
      `,
      [player.accountId, player.name, player.color, player.displayName]
    );
  }

  async upsert(player: IPlayer) {
    return this.db.upsert(
      this.insert.bind(this),
      this.update.bind(this),
      player
    );
  }
}
