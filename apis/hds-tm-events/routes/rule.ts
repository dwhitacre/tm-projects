import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Rule, RuleCategory } from "../domain/rule";

class RuleRoute extends Route {
  async leaderboardHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.methodNotAllowed(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const rules = await req.services.rule.getAll(leaderboardId);
    if (!rules) return ApiResponse.badRequest(req);

    return ApiResponse.ok(req, { rules: rules.map((rule) => rule.toJson()) });
  }

  async categoryHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const category = await req.parse(RuleCategory);
    if (!category) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.rule.insertRuleCategory(category);
      return ApiResponse.ok(req);
    }

    if (req.checkMethod("post")) {
      await req.services.rule.updateRuleCategory(category);
      return ApiResponse.ok(req);
    }

    await req.services.rule.deleteRuleCategory(category);
    return ApiResponse.ok(req);
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const rule = await req.parse(Rule);
    if (!rule) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.rule.insert(rule);
      return ApiResponse.ok(req);
    }

    if (req.checkMethod("post")) {
      await req.services.rule.update(rule);
      return ApiResponse.ok(req);
    }

    await req.services.rule.delete(rule);
    return ApiResponse.ok(req);
  }
}

export default new RuleRoute();
