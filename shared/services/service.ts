import { Json } from "../domain/json";

export interface ServiceOptions {
  debug: boolean;
}

export class Service {
  options: ServiceOptions;

  constructor(options: Partial<ServiceOptions>) {
    this.options = Json.merge(
      {
        debug: false,
      },
      options
    ) as ServiceOptions;
  }
}
