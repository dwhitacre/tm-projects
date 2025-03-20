import db from "./db";
import leaderboard from "./leaderboard";
import logger from "./logger";
import player from "./player";
import tmio from "./tmio";

const services = {
  logger,
  db,
  tmio,
  player: player(db),
  leaderboard: leaderboard(db),
};
export type Services = typeof services;
export default services;
