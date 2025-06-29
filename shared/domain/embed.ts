export interface Embed {
  embedId: number;
  title: string;
  description: string;
  image: string;
  url: string;
  type: "website";
  dateCreated?: Date;
  dateModified?: Date;
  dateExpired?: Date;
}
