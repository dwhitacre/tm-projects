import type { Db } from "../domain/db";
import { Json } from "../domain/json";

export interface RepositoryOptions {
  db: Db;
  debug: boolean;
}

export class Repository {
  options: RepositoryOptions;
  db: Db;

  constructor(options: Partial<RepositoryOptions>) {
    if (typeof options.db === "undefined")
      throw new Error("options.db is required.");

    this.options = Json.merge(
      {
        debug: false,
      },
      options
    ) as RepositoryOptions;

    this.db = this.options.db;
  }
}
