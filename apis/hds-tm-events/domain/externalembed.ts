import { Event } from "./event";

export type ExternalEmbed = {
  eventId: Event["eventId"];
  title: string;
  description: string;
  image: string;
  imageExtension: string;
  url: string;
  type: "website";
};
