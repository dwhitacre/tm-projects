import type { ApiResponse } from "./apiresponse";

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
}

export interface EventResponse extends ApiResponse {
  events: Event[];
}
