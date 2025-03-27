import type { Permissions, Player } from "../domain/player";
import { Repository, type RepositoryOptions } from "./repository";

export class PlayerPermissionRepository extends Repository {
  constructor(options: Partial<RepositoryOptions>) {
    super(options);
  }

  insert(accountId: Player["accountId"], permissionName: Permissions) {
    return this.db.insert(
      `
        insert into PlayerPermissions(AccountId, PermissionId)
        values ($1, (select Id from Permissions where Name = $2))
      `,
      [accountId, permissionName]
    );
  }

  delete(accountId: Player["accountId"], permissionName: Permissions) {
    return this.db.delete(
      `
        delete from PlayerPermissions
        where AccountId = $1 and PermissionId = (select Id from Permissions where Name = $2)
      `,
      [accountId, permissionName]
    );
  }
}
