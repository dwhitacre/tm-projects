import type { ApiResponse } from "./apiresponse";
import type { TeamPlayer } from "./team";
import type { TeamRole } from "./teamrole";

export interface EventPlayer extends TeamPlayer {
  eventRoleId: number;
  eventRole?: TeamRole;
}

export interface Event {
  eventId: number;
  name: string;
  description: string;
  dateStart?: Date;
  dateEnd?: Date;
  externalUrl: string;
  image: string;
  isVisible: boolean;
  sortOrder: number;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: number;
  players: EventPlayer[];
}

export interface EventResponse extends ApiResponse {
  events: Event[];
}
