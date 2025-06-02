import { Client, type ClientOptions } from "./client";
import type { Map } from "../domain/map";
import type { Match } from "../domain/match";
import type { IPlayer } from "../domain/player";
import type { Weekly } from "../domain/weekly";
import type { Leaderboard } from "../domain/leaderboard";
import type { AdminResponse } from "../domain/admin";
import type { ReadyResponse } from "../domain/ready";
import type { RuleResponse, Rule, RuleCategory } from "../domain/rule";
import type {
  Event,
  EventPlayer,
  EventResponse,
  EventsResponse,
} from "../domain/event";
import type { Post, PostResponse } from "../domain/post";
import type { Tag, TagResponse } from "../domain/tag";
import type { Team, TeamPlayer, TeamResponse } from "../domain/team";
import type { TeamRole, TeamRoleResponse } from "../domain/teamrole";
import type {
  Organization,
  OrganizationResponse,
} from "../domain/organization";

export class HdstmEventsClient extends Client {
  constructor(options: Partial<ClientOptions>) {
    super(options);
  }

  _ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  join() {
    return this.httpGet(`/join`);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/api/ready`);
  }

  checkAdmin() {
    return this.httpGet<AdminResponse>(`/api/admin`);
  }

  getMap(mapUid: Map["mapUid"]) {
    return this.httpGet<Map>(`/api/map/${mapUid}`);
  }

  getAllMaps() {
    return this.httpGet<Map[]>(`/api/map`);
  }

  createMap(mapUid: Map["mapUid"]) {
    return this.httpPut(`/api/map`, {
      mapUid,
    });
  }

  updateMap(mapUid: Map["mapUid"]) {
    return this.createMap(mapUid);
  }

  async createMapBulk(maps: Map["mapUid"][]) {
    for (let i = 0; i < maps.length; i++) {
      await this.createMap(maps[i]!);
    }
  }

  createMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number = 0
  ) {
    return this.httpPut(`/api/match/${matchId}/matchresult`, {
      accountId,
      score,
    });
  }

  updateMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number
  ) {
    return this.httpPost(`/api/match/${matchId}/matchresult`, {
      accountId,
      score,
    });
  }

  async createAndUpdateMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number
  ) {
    await this.createMatchResult(matchId, accountId);
    return this.updateMatchResult(matchId, accountId, score);
  }

  async createAndUpdateMatchResultBulk(
    matchId: Match["matchId"],
    accountIds: IPlayer["accountId"][],
    score = 100
  ) {
    for (let i = 0; i < accountIds.length; i++) {
      await this.createAndUpdateMatchResult(matchId, accountIds[i]!, score);
      score += 100;
    }
  }

  deleteMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"]
  ) {
    return this.httpDelete(`/api/match/${matchId}/matchresult`, {
      accountId,
    });
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<IPlayer>(`/api/player/${accountId}`);
  }

  getAllPlayers() {
    return this.httpGet<IPlayer[]>(`/api/player`);
  }

  createPlayer(accountId: IPlayer["accountId"]) {
    return this.httpPut(`/api/player`, {
      accountId,
    });
  }

  async createPlayerBulk(accountIds: IPlayer["accountId"][]) {
    for (let i = 0; i < accountIds.length; i++) {
      await this.createPlayer(accountIds[i]!);
    }
  }

  createWeekly(weeklyId: Weekly["weeklyId"]) {
    return this.httpPut("/api/weekly", { weeklyId });
  }

  getWeeklyMaps(weeklyId: Weekly["weeklyId"]) {
    return this.httpGet<Map[]>(`/api/weekly/${weeklyId}/map`);
  }

  createWeeklyMap(weeklyId: Weekly["weeklyId"], mapUid: Map["mapUid"]) {
    return this.httpPut(`/api/weekly/${weeklyId}/map`, { mapUid });
  }

  deleteWeeklyMap(weeklyId: Weekly["weeklyId"], mapUid: Map["mapUid"]) {
    return this.httpDelete(`/api/weekly/${weeklyId}/map`, { mapUid });
  }

  getLeaderboard(leaderboardId: Leaderboard["leaderboardId"]) {
    return this.httpGet<Leaderboard>(`/api/leaderboard/${leaderboardId}`);
  }

  createLeaderboardWeekly(
    leaderboardId: Leaderboard["leaderboardId"],
    weeklies: Array<Weekly["weeklyId"]>
  ) {
    return this.httpPatch(`/api/leaderboard`, {
      leaderboardId,
      weeklies: weeklies.map((weeklyId) => ({ weekly: { weeklyId } })),
    });
  }

  createRuleCategory(
    leaderboardId: Leaderboard["leaderboardId"],
    ruleCategory: Partial<RuleCategory> = {}
  ) {
    return this.httpPut(`/api/rulecategory`, {
      leaderboardId,
      ...ruleCategory,
    });
  }

  updateRuleCategory(
    leaderboardId: Leaderboard["leaderboardId"],
    ruleCategoryId: RuleCategory["ruleCategoryId"],
    ruleCategory: Partial<RuleCategory> = {}
  ) {
    return this.httpPost(`/api/rulecategory`, {
      leaderboardId,
      ruleCategoryId,
      ...ruleCategory,
    });
  }

  deleteRuleCategory(
    leaderboardId: Leaderboard["leaderboardId"],
    ruleCategoryId: RuleCategory["ruleCategoryId"]
  ) {
    return this.httpDelete(`/api/rulecategory`, {
      leaderboardId,
      ruleCategoryId,
    });
  }

  createRule(
    ruleCategoryId: RuleCategory["ruleCategoryId"],
    rule: Partial<Rule> = {}
  ) {
    return this.httpPut(`/api/rule`, {
      ruleCategoryId,
      ...rule,
    });
  }

  updateRule(
    ruleCategoryId: RuleCategory["ruleCategoryId"],
    ruleId: Rule["ruleId"],
    rule: Partial<Rule> = {}
  ) {
    return this.httpPost(`/api/rule`, {
      ruleCategoryId,
      ruleId,
      ...rule,
    });
  }

  deleteRule(
    ruleCategoryId: RuleCategory["ruleCategoryId"],
    ruleId: Rule["ruleId"]
  ) {
    return this.httpDelete(`/api/rule`, {
      ruleCategoryId,
      ruleId,
    });
  }

  getRules(leaderboardId: Leaderboard["leaderboardId"]) {
    return this.httpGet<RuleResponse>(`/api/leaderboard/${leaderboardId}/rule`);
  }

  getOrganizations() {
    return this.httpGet<OrganizationResponse>(`/api/organization`);
  }

  createOrganization(organization: Partial<Organization>) {
    return this.httpPut(`/api/organization`, organization);
  }

  updateOrganization(organization: Partial<Organization>) {
    return this.httpPost(`/api/organization`, organization);
  }

  deleteOrganization(organizationId: Organization["organizationId"]) {
    return this.httpDelete(`/api/organization`, { organizationId });
  }

  getTeamRoles(organizationId: TeamRole["organizationId"]) {
    return this.httpGet<TeamRoleResponse>(
      `/api/organization/${organizationId}/teamrole`
    );
  }

  createTeamRole(role: Partial<TeamRole>) {
    return this.httpPut(`/api/teamrole`, role);
  }

  updateTeamRole(role: Partial<TeamRole>) {
    return this.httpPost(`/api/teamrole`, role);
  }

  deleteTeamRole(
    teamRoleId: TeamRole["teamRoleId"],
    organizationId: TeamRole["organizationId"]
  ) {
    return this.httpDelete(`/api/teamrole`, { teamRoleId, organizationId });
  }

  getTeams(organizationId: Team["organizationId"]) {
    return this.httpGet<TeamResponse>(
      `/api/organization/${organizationId}/team`
    );
  }

  createTeam(team: Partial<Team>) {
    return this.httpPut(`/api/team`, team);
  }

  updateTeam(team: Partial<Team>) {
    return this.httpPost(`/api/team`, team);
  }

  deleteTeam(teamId: Team["teamId"], organizationId: Team["organizationId"]) {
    return this.httpDelete(`/api/team`, { teamId, organizationId });
  }

  createTeamPlayer(teamId: Team["teamId"], teamPlayer: Partial<TeamPlayer>) {
    return this.httpPut(`/api/team/${teamId}/player`, teamPlayer);
  }

  updateTeamPlayer(teamId: Team["teamId"], teamPlayer: Partial<TeamPlayer>) {
    return this.httpPost(`/api/team/${teamId}/player`, teamPlayer);
  }

  deleteTeamPlayer(teamId: Team["teamId"], accountId: TeamPlayer["accountId"]) {
    return this.httpDelete(`/api/team/${teamId}/player`, { accountId });
  }

  getTags(organizationId: Tag["organizationId"]) {
    return this.httpGet<TagResponse>(`/api/organization/${organizationId}/tag`);
  }

  createTag(tag: Partial<Tag>) {
    return this.httpPut(`/api/tag`, tag);
  }

  updateTag(tag: Partial<Tag>) {
    return this.httpPost(`/api/tag`, tag);
  }

  deleteTag(tagId: Tag["tagId"], organizationId: Tag["organizationId"]) {
    return this.httpDelete(`/api/tag`, { tagId, organizationId });
  }

  getPosts(organizationId: Post["organizationId"]) {
    return this.httpGet<PostResponse>(
      `/api/organization/${organizationId}/post`
    );
  }

  createPost(post: Partial<Post>) {
    return this.httpPut(`/api/post`, post);
  }

  updatePost(post: Partial<Post>) {
    return this.httpPost(`/api/post`, post);
  }

  deletePost(postId: Post["postId"], organizationId: Post["organizationId"]) {
    return this.httpDelete(`/api/post`, { postId, organizationId });
  }

  createPostTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.httpPut(`/api/post/${postId}/tag/${tagId}`, {});
  }

  updatePostTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.httpPost(`/api/post/${postId}/tag/${tagId}`, {});
  }

  deletePostTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.httpDelete(`/api/post/${postId}/tag/${tagId}`, {});
  }

  getEvents(organizationId: Event["organizationId"]) {
    return this.httpGet<EventsResponse>(
      `/api/organization/${organizationId}/event`
    );
  }

  createEvent(event: Partial<Event>) {
    return this.httpPut<EventResponse>(`/api/event`, event);
  }

  updateEvent(event: Partial<Event>) {
    return this.httpPost(`/api/event`, event);
  }

  deleteEvent(
    eventId: Event["eventId"],
    organizationId: Event["organizationId"]
  ) {
    return this.httpDelete(`/api/event`, { eventId, organizationId });
  }

  createEventPlayer(
    eventId: Event["eventId"],
    eventPlayer: Partial<EventPlayer>
  ) {
    return this.httpPut(`/api/event/${eventId}/player`, eventPlayer);
  }

  updateEventPlayer(
    eventId: Event["eventId"],
    eventPlayer: Partial<EventPlayer>
  ) {
    return this.httpPost(`/api/event/${eventId}/player`, eventPlayer);
  }

  deleteEventPlayer(
    eventId: Event["eventId"],
    accountId: EventPlayer["accountId"]
  ) {
    return this.httpDelete(`/api/event/${eventId}/player`, { accountId });
  }
}
