import Json from "./json";

export enum GameModeScoreType {
  PlayerCurrentBest = "playercurrentbest",
  PlayerMostRecent = "playermostrecent",
  PlayerLatest = "playerlatest",
  PlayerBest = "playerbest",
  AllCurrentBest = "allcurrentbest",
  AllMostRecent = "allmostrecent",
  AllLatest = "alllatest",
  AllBest = "allbest",
}

export const GameModeScoreTypes: Array<string | undefined> =
  Object.values(GameModeScoreType);

export class GameModeScore {
  accountId: string;
  gameModeId: string;
  score: number;
  dateModified?: Date;
  id?: number;

  static fromJson(json: { [_: string]: any }): GameModeScore {
    json = Json.lowercaseKeys(json);

    if (!json.accountid) throw new Error("Failed to get accountId");
    if (!json.gamemodeid) throw new Error("Failed to get gameModeId");
    if (!json.score) throw new Error("Failed to get score");

    const gameModeScore = new GameModeScore(
      json.accountid,
      json.gamemodeid,
      json.score
    );
    if (json.datemodified) gameModeScore.dateModified = json.datemodified;
    if (json.id) gameModeScore.id = json.id;

    return gameModeScore;
  }

  constructor(accountId: string, gameModeId: string, score: number) {
    this.accountId = accountId;
    this.gameModeId = gameModeId;
    this.score = score;
  }

  toJson() {
    return {
      accountId: this.accountId,
      gameModeId: this.gameModeId,
      score: this.score,
      dateModified: this.dateModified,
      id: this.id,
    };
  }
}

export default GameModeScore;
