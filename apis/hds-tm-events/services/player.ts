import type { Db } from "./db";
import { Player } from "../domain/player";

export class PlayerService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(accountId: Player["accountId"]): Promise<Player | undefined> {
    const result = await this.db.selectOne(
      `
        select p.AccountId, p.TmioData, po.Name, po.Image, po.Twitch, po.Discord
        from Player p
        left join PlayerOverrides po on p.AccountId = po.AccountId 
        where p.AccountId = $1
      `,
      [accountId]
    );

    return result ? Player.fromJson(result) : result;
  }

  async getAll(): Promise<Array<Player>> {
    const result = await this.db.select(
      `
        select p.AccountId, p.TmioData, po.Name, po.Image, po.Twitch, po.Discord
        from Player p
        left join PlayerOverrides po on p.AccountId = po.AccountId
      `
    );
    return result.map(Player.fromJson);
  }

  async insert(player: Player) {
    return this.db.insert(
      `
        insert into Player (AccountId, TmioData)
        values ($1, $2)
      `,
      [player.accountId, player.tmioData]
    );
  }

  async update(player: Player) {
    return this.db.update(
      `
        update Player
        set TmioData=$2
        where AccountId=$1
      `,
      [player.accountId, player.tmioData]
    );
  }

  async upsert(player: Player) {
    return this.db.upsert(
      this.insert.bind(this),
      this.update.bind(this),
      player
    );
  }
}

export default (db: Db) => new PlayerService(db);
