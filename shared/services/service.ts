import { Json } from "../domain/json";
import type { RepositoryOptions } from "../repositories/repository";

export interface ServiceOptions extends RepositoryOptions {}

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
