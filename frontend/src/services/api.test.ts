import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  aiApi,
  authApi,
  leaderboardApi,
  notificationsApi,
  reportsApi,
  statsApi,
  usersApi,
} from "./api";

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("sends login request with expected payload", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ accessToken: "abc" }),
    } as unknown as Response);

    const result = await authApi.login("demo@mail.com", "secret");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "demo@mail.com", password: "secret" }),
      }),
    );
    expect(result).toEqual({ accessToken: "abc" });
  });

  it("adds bearer token when token exists", async () => {
    localStorage.setItem("cw_token", "token-123");
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "usr_1" }),
    } as unknown as Response);

    await usersApi.getMe();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/users/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
        }),
      }),
    );
  });

  it("builds report query string and skips nullish values", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    await reportsApi.list({ status: "open", district: null, page: 1 });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/reports?status=open&page=1",
      expect.any(Object),
    );
  });

  it("returns null for 204 responses", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
    } as unknown as Response);

    const result = await authApi.logout();

    expect(result).toBeNull();
  });

  it("throws backend error message for non-ok responses", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: "Invalid payload" }),
    } as unknown as Response);

    await expect(authApi.register({})).rejects.toThrow("Invalid payload");
  });

  it("clears token and exits early on unauthorized responses", async () => {
    localStorage.setItem("cw_token", "expired");
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem");
    vi.spyOn(window.location, "reload").mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn(),
    } as unknown as Response);

    const result = await usersApi.getMe();

    expect(removeSpy).toHaveBeenCalledWith("cw_token");
    expect(result).toBeUndefined();
  });

  it("calls report claim endpoint", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });

    await reportsApi.claim(123);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/reports/123/claim",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("calls report complete endpoint", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });

    const payload = new FormData();
    await reportsApi.complete(44, payload);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/reports/44/complete",
      expect.objectContaining({ method: "POST", body: payload }),
    );
  });

  it("calls leaderboard endpoint with defaults", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ content: [] }),
    });

    await leaderboardApi.get();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/leaderboard?period=week&page=0&size=20",
      expect.any(Object),
    );
  });

  it("calls stats endpoint", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ totalCleaned: 1 }),
    });

    await statsApi.getGlobal();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/stats/global",
      expect.any(Object),
    );
  });

  it("calls notifications unread filter endpoint", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    });

    await notificationsApi.list(true);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/notifications?unread=true",
      expect.any(Object),
    );
  });

  it("calls AI verify image endpoint", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ valid: true }),
    });

    const payload = new FormData();
    await aiApi.verifyImage(payload);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/ai/verify-image",
      expect.objectContaining({ method: "POST", body: payload }),
    );
  });
});
