import type { ApiResponse } from "./apiresponse";

export interface Config {
  pbLoopEnabled?: boolean;
  pbLoopInterval?: number;
  healthCheckEnabled: boolean;
  healthCheckMs: number;
}

export interface ConfigResponse extends ApiResponse {
  config?: Config;
}
