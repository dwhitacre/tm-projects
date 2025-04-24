import db from "./db";
import leaderboard from "./leaderboard";
import logger from "./logger";
import map from "./map";
import match from "./match";
import player from "./player";
import tmio from "./tmio";
import weekly from "./weekly";
import rule from "./rule";

const services = {
  logger,
  db,
  tmio,
  map: map(db),
  player: player(db),
  match: match(db),
  weekly: weekly(db),
  leaderboard: leaderboard(db),
  rule: rule(db),
};
export type Services = typeof services;
export default services;
