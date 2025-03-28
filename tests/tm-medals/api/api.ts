import { faker } from "@faker-js/faker";
import type { Pool } from "pg";
import { PlayerMedalsClient } from "shared/clients/playermedals";
import { Apikey } from "shared/domain/apikey";
import { Db } from "shared/domain/db";
import { Player } from "shared/domain/player";
import { ApikeyRepository } from "shared/repositories/apikey";
import { PlayerPermissionRepository } from "shared/repositories/playerpermission";
import { PlayerRepository } from "shared/repositories/player";

export const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});
export const adminClient = (apikey: string) =>
  new PlayerMedalsClient({
    baseUrl: "http://localhost:8084",
    apikey,
  });

export const apikeyCreate = (pool: Pool, accountId: string, key?: string) => {
  const apikey = new Apikey(accountId, key);
  return new ApikeyRepository({ db: new Db({ pool }) }).insert(apikey);
};

export const playerPermissionsCreate = async (
  pool: Pool,
  accountId: string,
  permissionName: string
) => {
  return new PlayerPermissionRepository({ db: new Db({ pool }) }).insert(
    accountId,
    permissionName
  );
};

export const playerPermissionsDelete = async (
  pool: Pool,
  accountId: string,
  permissionName: string
) => {
  return new PlayerPermissionRepository({ db: new Db({ pool }) }).delete(
    accountId,
    permissionName
  );
};

export const playerWithPermissionCreate = async (
  pool: Pool,
  permission: Array<string> | string,
  accountId: string = faker.string.uuid()
) => {
  permission = permission instanceof Array ? permission : [permission];

  await new PlayerRepository({ db: new Db({ pool }) }).insert(
    new Player(accountId, faker.internet.username())
  );

  for (let i = 0; i < permission.length; i++) {
    await playerPermissionsCreate(pool, accountId, permission[i]);
  }

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  return apikey;
};

export const playerAdminCreate = async (
  pool: Pool,
  accountId: string = faker.string.uuid()
) => playerWithPermissionCreate(pool, "admin", accountId);
