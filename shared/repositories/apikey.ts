import type { Apikey } from "../domain/apikey";
import { Repository, type RepositoryOptions } from "./repository";

export class ApikeyRepository extends Repository {
  constructor(options: Partial<RepositoryOptions>) {
    super(options);
  }

  insert(apikey: Apikey) {
    return this.db.insert(
      `
        insert into ApiKeys (AccountId, Key)
        values ($1, $2)
      `,
      [apikey.accountId, apikey.key]
    );
  }

  update(apikey: Apikey) {
    return this.db.update(
      `
        update ApiKeys
        set Key = $1
        where AccountId = $2
      `,
      [apikey.key, apikey.accountId]
    );
  }
}
