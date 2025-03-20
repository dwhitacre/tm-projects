import type ApiRequest from "../domain/apirequest";
import type ApiResponse from "../domain/apiresponse";

export abstract class Middleware {
  async applyRequest(_: ApiRequest): Promise<ApiRequest | void> {}
  async applyResponse(_: ApiResponse): Promise<ApiResponse | void> {}
}

export default Middleware;
