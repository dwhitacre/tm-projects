import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Post } from "shared/domain/post";
import type { Organization } from "shared/domain/organization";
import type { Tag } from "shared/domain/tag";
import type { JsonAny } from "shared/domain/json";
import { PlayerService } from "shared/services/player";
import { Db } from "shared/domain/db";
import type { IPlayer } from "shared/domain/player";

let db: Db;
let playerService: PlayerService;
const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});

const adminClient = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikey: "developer-test-key",
  apikeyHeader: "x-hdstmevents-adminkey",
});

async function createTestOrganization(): Promise<Organization> {
  const org: Partial<Organization> = {
    name: "org-" + faker.company.name() + "-" + faker.string.alphanumeric(8),
    description: faker.company.catchPhrase(),
    image: faker.image.avatar(),
  };
  await adminClient.createOrganization(org);
  const getResp = await client.getOrganizations();
  const json = await getResp.json();
  const created = json.organizations.find(
    (o: Organization) => o.name === org.name
  );
  expect(created).toBeDefined();
  return created!;
}

async function createTestPlayer(
  accountId: string,
  overrides?: Partial<IPlayer>
) {
  const resp = await adminClient.createPlayer(accountId);
  expect([200, 201]).toContain(resp.status);
  if (overrides) {
    await playerService.addPlayerOverrides(
      accountId,
      overrides.name,
      overrides.image,
      overrides.twitch,
      overrides.discord
    );
  }
}

async function createTestTag(
  organizationId: number,
  name?: string
): Promise<Tag> {
  const tag: Partial<Tag> = {
    name: name || faker.lorem.word(),
    organizationId,
    isVisible: true,
    sortOrder: 0,
  };
  const resp = await adminClient.createTag(tag);
  expect(resp.status).toBe(201);
  const getResp = await client.getTags(organizationId);
  const json = await getResp.json();
  const created = json.tags.find((t: Tag) => t.name === tag.name);
  expect(created).toBeDefined();
  return created!;
}

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://hdstmevents:Passw0rd!@localhost:5432/hdstmevents?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
});

afterAll(async () => {
  await db.close();
});

describe("/api/post", () => {
  test("create post not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const response = await client.createPost(post);
    expect(response.status).toBe(403);
  });

  test("create post bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const response = await adminClient.httpPatch("/api/post", post);
    expect(response.status).toBe(405);
  });

  test("create post bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/post",
      undefined as unknown as Post
    );
    expect(response.status).toBe(400);
  });

  test("create post", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const response = await adminClient.createPost(post);
    expect(response.status).toBe(201);

    const createdPost = await response.json();
    expect(createdPost).toBeDefined();
    expect(createdPost.post).toBeDefined();
    expect<string | undefined>(createdPost.post.content).toBe(post.content);
    expect(createdPost.post.organizationId).toBe(org.organizationId);
    expect(createdPost.post.postId).toBeDefined();
    expect(createdPost.post.dateCreated).toBeDefined();
    expect(createdPost.post.dateModified).toBeDefined();

    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    expect<string | undefined>(created!.content).toBe(post.content);
    expect(created!.organizationId).toBe(org.organizationId);
    expect(created!.postId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update post not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const updateResp = await client.updatePost({
      ...created,
      content: "Should not update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update post bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch(
      "/api/post",
      created as unknown as JsonAny
    );
    expect(resp.status).toBe(405);
  });

  test("update post bad body", async () => {
    const resp = await adminClient.updatePost(undefined as unknown as Post);
    expect(resp.status).toBe(400);
  });

  test("update post", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const updatedContent = post.content + " updated";
    const updateResp = await adminClient.updatePost({
      ...created,
      content: updatedContent,
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getPosts(org.organizationId);
    const json2 = await getResp2.json();
    const updated = json2.posts.find((p: Post) => p.content === updatedContent);
    expect(updated).toBeDefined();
    expect(updated!.content).toBe(updatedContent);
    expect(updated!.organizationId).toBe(org.organizationId);
    expect(updated!.postId).toBe(created!.postId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete post not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const delResp = await client.deletePost(
      created!.postId,
      org.organizationId
    );
    expect(delResp.status).toBe(403);
  });

  test("delete post bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/post", {
      postId: created!.postId,
      organizationId: org.organizationId,
    });
    expect(resp.status).toBe(405);
  });

  test("delete post bad body", async () => {
    const org = await createTestOrganization();
    const resp = await adminClient.deletePost(
      "notanumber" as unknown as number,
      org.organizationId
    );
    expect(resp.status).toBe(400);
  });

  test("delete post", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    await adminClient.createPost(post);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const created = json.posts.find((p: Post) => p.content === post.content);
    expect(created).toBeDefined();
    const delResp = await adminClient.deletePost(
      created!.postId,
      org.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getPosts(org.organizationId);
    const json2 = await getResp2.json();
    expect(json2.posts.some((p: Post) => p.postId === created!.postId)).toBe(
      false
    );
  });

  test("get posts for organization bad org id", async () => {
    const resp = await client.getPosts(999999999);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.posts)).toBe(true);
  });

  test("get posts for organization with non-numeric org id returns 400", async () => {
    const resp = await client.getPosts("notanumber" as unknown as number);
    expect(resp.status).toBe(400);
  });

  test("get posts returns empty array for new org", async () => {
    const org = await createTestOrganization();
    const resp = await client.getPosts(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBe(0);
  });

  test("get posts returns multiple posts", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    // Add player with overrides
    const overrides = {
      name: "Override Name",
      image: "https://override.example/avatar.png",
      twitch: "override_twitch",
      discord: "override#1234",
    };
    await createTestPlayer(accountId, overrides);
    const post1: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: "post1-" + faker.string.alphanumeric(8),
    };
    const post2: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: "post2-" + faker.string.alphanumeric(8),
    };
    await adminClient.createPost(post1);
    await adminClient.createPost(post2);
    const resp = await client.getPosts(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBeGreaterThanOrEqual(2);
    const contents = json.posts.map((p: Post) => p.content);
    expect(contents).toContain(post1.content);
    expect(contents).toContain(post2.content);
    // Assert author is returned and matches player with overrides
    for (const post of json.posts as Post[]) {
      expect(post.author).toBeDefined();
      expect(post.author!.accountId).toBe(post.accountId);
      expect(post.author!.name).toBe(overrides.name);
      expect(post.author!.image).toBe(overrides.image);
      expect(post.author!.twitch).toBe(overrides.twitch);
      expect(post.author!.discord).toBe(overrides.discord);
    }
  });

  test("get posts only returns posts for that org", async () => {
    const org1 = await createTestOrganization();
    const org2 = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post1: Partial<Post> = {
      accountId,
      organizationId: org1.organizationId,
      content: "post-org1-" + faker.string.alphanumeric(8),
    };
    const post2: Partial<Post> = {
      accountId,
      organizationId: org2.organizationId,
      content: "post-org2-" + faker.string.alphanumeric(8),
    };
    await adminClient.createPost(post1);
    await adminClient.createPost(post2);
    const resp1 = await client.getPosts(org1.organizationId);
    const json1 = await resp1.json();
    expect(json1.posts.some((p: Post) => p.content === post1.content)).toBe(
      true
    );
    expect(json1.posts.some((p: Post) => p.content === post2.content)).toBe(
      false
    );
    const resp2 = await client.getPosts(org2.organizationId);
    const json2 = await resp2.json();
    expect(json2.posts.some((p: Post) => p.content === post2.content)).toBe(
      true
    );
    expect(json2.posts.some((p: Post) => p.content === post1.content)).toBe(
      false
    );
  });
});

describe("/api/post/{postId}/tag/{tagId}", () => {
  test("create post tag not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    const response = await client.createPostTag(createdPost!.postId, tag.tagId);
    expect(response.status).toBe(403);
  });

  test("create post tag bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    const response = await adminClient.httpPatch(
      `/api/post/${createdPost!.postId}/tag/${tag.tagId}`,
      {}
    );
    expect(response.status).toBe(405);
  });

  test("create post tag bad postId or tagId", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    const createResp = await adminClient.createPostTag(99999999, tag.tagId);
    expect(createResp.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const badTagResp = await adminClient.createPostTag(
      createdPost!.postId,
      99999999
    );
    expect(badTagResp.status).toBe(400);
  });

  test("create post tag with non-numeric postId or tagId returns 400", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    const resp1 = await adminClient.createPostTag(
      "notanumber" as unknown as Post["postId"],
      tag.tagId
    );
    expect(resp1.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const resp2 = await adminClient.createPostTag(
      createdPost!.postId,
      "notanumber" as unknown as Tag["tagId"]
    );
    expect(resp2.status).toBe(400);
  });

  test("create post tag", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    const createResp = await adminClient.createPostTag(
      createdPost!.postId,
      tag.tagId
    );
    expect(createResp.status).toBe(201);
    const getPostResp2 = await client.getPosts(org.organizationId);
    const getPostJson2 = await getPostResp2.json();
    const postWithTag = getPostJson2.posts.find(
      (p: Post) => p.postId === createdPost!.postId
    );
    expect(postWithTag).toBeDefined();
    expect(postWithTag!.tags).toBeDefined();
    expect(postWithTag!.tags!.some((t: Tag) => t.tagId === tag.tagId)).toBe(
      true
    );
  });

  test("update post tag not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const response = await client.updatePostTag(createdPost!.postId, tag.tagId);
    expect(response.status).toBe(403);
  });

  test("update post tag bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const response = await adminClient.httpPatch(
      `/api/post/${createdPost!.postId}/tag/${tag.tagId}`,
      {}
    );
    expect(response.status).toBe(405);
  });

  test("update post tag bad postId or tagId", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    const updateResp = await adminClient.updatePostTag(99999999, tag.tagId);
    expect(updateResp.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const badTagResp = await adminClient.updatePostTag(
      createdPost!.postId,
      99999999
    );
    expect(badTagResp.status).toBe(400);
  });

  test("update post tag with non-numeric postId or tagId returns 400", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    const resp1 = await adminClient.updatePostTag(
      "notanumber" as unknown as Post["postId"],
      tag.tagId
    );
    expect(resp1.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const resp2 = await adminClient.updatePostTag(
      createdPost!.postId,
      "notanumber" as unknown as Tag["tagId"]
    );
    expect(resp2.status).toBe(400);
  });

  test("update post tag", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const updateResp = await adminClient.updatePostTag(
      createdPost!.postId,
      tag.tagId
    );
    expect(updateResp.status).toBe(200);
    // Confirm tag is still attached
    const getPostResp2 = await client.getPosts(org.organizationId);
    const getPostJson2 = await getPostResp2.json();
    const postWithTag = getPostJson2.posts.find(
      (p: Post) => p.postId === createdPost!.postId
    );
    expect(postWithTag).toBeDefined();
    expect(postWithTag!.tags).toBeDefined();
    expect(postWithTag!.tags!.some((t: Tag) => t.tagId === tag.tagId)).toBe(
      true
    );
  });

  test("delete post tag not admin", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const response = await client.deletePostTag(createdPost!.postId, tag.tagId);
    expect(response.status).toBe(403);
  });

  test("delete post tag bad method", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const response = await adminClient.httpPatch(
      `/api/post/${createdPost!.postId}/tag/${tag.tagId}`,
      {}
    );
    expect(response.status).toBe(405);
  });

  test("delete post tag bad postId or tagId", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    // Bad postId
    const deleteResp = await adminClient.deletePostTag(99999999, tag.tagId);
    expect(deleteResp.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const badTagResp = await adminClient.deletePostTag(
      createdPost!.postId,
      99999999
    );
    expect(badTagResp.status).toBe(400);
  });

  test("delete post tag with non-numeric postId or tagId returns 400", async () => {
    const org = await createTestOrganization();
    const tag = await createTestTag(org.organizationId);
    const resp1 = await adminClient.deletePostTag(
      "notanumber" as unknown as Post["postId"],
      tag.tagId
    );
    expect(resp1.status).toBe(400);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const resp2 = await adminClient.deletePostTag(
      createdPost!.postId,
      "notanumber" as unknown as Tag["tagId"]
    );
    expect(resp2.status).toBe(400);
  });

  test("delete post tag", async () => {
    const org = await createTestOrganization();
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    const post: Partial<Post> = {
      accountId,
      organizationId: org.organizationId,
      content: faker.lorem.sentence(),
    };
    const postResp = await adminClient.createPost(post);
    expect(postResp.status).toBe(201);
    const getResp = await client.getPosts(org.organizationId);
    const json = await getResp.json();
    const createdPost = json.posts.find(
      (p: Post) => p.content === post.content
    );
    expect(createdPost).toBeDefined();
    const tag = await createTestTag(org.organizationId);
    await adminClient.createPostTag(createdPost!.postId, tag.tagId);
    const deleteResp = await adminClient.deletePostTag(
      createdPost!.postId,
      tag.tagId
    );
    expect(deleteResp.status).toBe(200);
    // Confirm tag is removed
    const getPostResp2 = await client.getPosts(org.organizationId);
    const getPostJson2 = await getPostResp2.json();
    const postAfterDelete = getPostJson2.posts.find(
      (p: Post) => p.postId === createdPost!.postId
    );
    expect(postAfterDelete).toBeDefined();
    expect(postAfterDelete!.tags).toBeDefined();
    expect(postAfterDelete!.tags!.some((t: Tag) => t.tagId === tag.tagId)).toBe(
      false
    );
  });
});
