import Json from "./json";

export class Map {
  mapUid: string;
  authorTime: number;
  name: string;
  campaign?: string;
  campaignIndex?: number;
  totdDate?: string;
  dateModified?: Date;
  nadeo?: boolean;

  static fromJson(json: { [_: string]: any }): Map {
    json = Json.lowercaseKeys(json);

    if (!json?.mapuid) throw new Error("Failed to get mapUid");
    if (!json.authortime) throw new Error("Failed to get authorTime");
    if (!json.name) throw new Error("Failed to get name");

    const map = new Map(json.mapuid, json.authortime, json.name);
    if (json.campaign || json.campaign === "") map.campaign = json.campaign;
    if (json.campaignindex || json.campaignindex === 0)
      map.campaignIndex = json.campaignindex;
    if (json.totddate || json.totddate === "") map.totdDate = json.totddate;
    if (json.datemodified) map.dateModified = json.datemodified;
    if (json.nadeo || json.nadeo === false) map.nadeo = json.nadeo;

    return map;
  }

  constructor(mapUid: string, authorTime: number, name: string) {
    this.mapUid = mapUid;
    this.authorTime = authorTime;
    this.name = name;
  }

  toJson(): { [_: string]: any } {
    return {
      mapUid: this.mapUid,
      authorTime: this.authorTime,
      name: this.name,
      campaign: this.campaign,
      campaignIndex: this.campaignIndex,
      totdDate: this.totdDate,
      dateModified: this.dateModified,
      nadeo: this.nadeo,
    };
  }
}

export default Map;
