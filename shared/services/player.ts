import { Apikey } from "../domain/apikey";
import { Permissions, type IPlayer } from "../domain/player";
import { ApikeyRepository } from "../repositories/apikey";
import { PlayerRepository } from "../repositories/player";
import { PlayerPermissionRepository } from "../repositories/playerpermission";
import { Service, type ServiceOptions } from "./service";

export class PlayerService extends Service {
  playerRepository: PlayerRepository;
  playerPermissionRepository: PlayerPermissionRepository;
  apikeyRepository: ApikeyRepository;

  constructor(
    options: Partial<ServiceOptions>,
    playerRepository: PlayerRepository,
    playerPermissionRepository: PlayerPermissionRepository,
    apikeyRepository: ApikeyRepository
  ) {
    super(options);
    this.playerRepository = playerRepository;
    this.playerPermissionRepository = playerPermissionRepository;
    this.apikeyRepository = apikeyRepository;
  }

  static getInstance(options: Partial<ServiceOptions>) {
    return new PlayerService(
      options,
      new PlayerRepository(options),
      new PlayerPermissionRepository(options),
      new ApikeyRepository(options)
    );
  }

  async create(player: IPlayer, permissions: Array<Permissions> = []) {
    await this.playerRepository.insert(player);
    for (let i = 0; i < permissions.length; i++) {
      await this.addPermission(player, permissions[i]!);
    }
  }

  async createWithApikey(
    player: IPlayer,
    permissions: Array<Permissions> = []
  ) {
    await this.create(player, permissions);
    return this.addApikey(player);
  }

  async createAdmin(player: IPlayer) {
    return this.createWithApikey(player, [Permissions.Admin]);
  }

  async addPermission(player: IPlayer, permission: Permissions) {
    await this.playerPermissionRepository.insert(player.accountId, permission);
  }

  async removePermission(player: IPlayer, permission: Permissions) {
    await this.playerPermissionRepository.delete(player.accountId, permission);
  }

  async addApikey(player: IPlayer) {
    const apikey = new Apikey(player.accountId);
    await this.apikeyRepository.insert(apikey);
    return apikey.key;
  }

  async updateApikey(player: IPlayer) {
    const apikey = new Apikey(player.accountId);
    await this.apikeyRepository.update(apikey);
    return apikey.key;
  }

  async removeApikey(player: IPlayer) {
    await this.apikeyRepository.delete(player.accountId);
  }
}
