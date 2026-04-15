import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi, reportsApi, usersApi } from "../services/api";

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("sends login request with expected payload", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ accessToken: "abc" }),
    });

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
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "usr_1" }),
    });

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

  it("uses status endpoint for report filtering", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    });

    await reportsApi.list({ status: "NEW" });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/reports/status/NEW",
      expect.any(Object),
    );
  });

  it("returns null for 204 responses", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const result = await authApi.logout();

    expect(result).toBeNull();
  });

  it("throws backend error message for non-ok responses", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: "Invalid payload" }),
    });

    await expect(authApi.register({})).rejects.toThrow("Invalid payload");
  });

  it("clears token and exits early on unauthorized responses", async () => {
    localStorage.setItem("cw_token", "expired");
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem");
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn(),
    });

    const result = await usersApi.getMe();

    expect(removeSpy).toHaveBeenCalledWith("cw_token");
    expect(result).toBeUndefined();
  });
});
