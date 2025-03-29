import { expect, test } from "bun:test";
import { PlayerMedalsClient } from "shared/clients/playermedals";
import type { CampaignIndicesResponse } from "shared/domain/campaignindices";

const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});

test("returns 200 on campaign-indices route", async () => {
  const response = await client.getCampaignIndices();
  expect(response.status).toEqual(200);

  const json: CampaignIndicesResponse = await response.json();

  expect(json.campaignIndices).toEqual({
    training: 0,
    "snow discovery": 1,
    "rally discovery": 2,
    "desert discovery": 3,
  });
});
