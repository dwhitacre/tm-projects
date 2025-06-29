import db from "./db";
import leaderboard from "./leaderboard";
import logger from "./logger";
import map from "./map";
import match from "./match";
import player from "./player";
import tmio from "./tmio";
import weekly from "./weekly";
import rule from "./rule";
import post from "./post";
import tag from "./tag";
import teamrole from "./teamrole";
import team from "./team";
import event from "./event";
import organization from "./organization";
import external from "./external";
import embed from "./embed";

const services = {
  logger,
  db,
  tmio,
  external,
  map: map(db),
  player: player(db),
  match: match(db),
  weekly: weekly(db),
  leaderboard: leaderboard(db),
  rule: rule(db),
  post: post(db),
  tag: tag(db),
  teamrole: teamrole(db),
  team: team(db),
  event: event(db),
  organization: organization(db),
  embed: embed(db),
};

export type Services = typeof services;
export default services;
