export interface Embed {
  embedId: number;
  title: string;
  description: string;
  image: string;
  url: string;
  type: "website";
  localImage: string;
  host: string;
  dateCreated?: Date;
  dateModified?: Date;
  dateExpired?: Date;
  blob?: Blob;
}
