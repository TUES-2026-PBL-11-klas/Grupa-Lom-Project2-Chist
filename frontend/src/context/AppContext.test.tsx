import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppProvider, useApp } from "./AppContext";

let latestCtx: any = null;
let root: ReturnType<typeof createRoot> | null = null;
let host: HTMLDivElement | null = null;

function Probe() {
  latestCtx = useApp();
  return null;
}

describe("AppContext", () => {
  beforeEach(() => {
    latestCtx = null;
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => {
      root!.render(
        <AppProvider>
          <Probe />
        </AppProvider>,
      );
    });
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
    }
    if (host) {
      document.body.removeChild(host);
    }
    root = null;
    host = null;
  });

  it("initializes with default state", () => {
    expect(latestCtx).toBeTruthy();
    expect(latestCtx!.reports.length).toBeGreaterThan(0);
    expect(latestCtx!.user.points).toBeGreaterThan(0);
  });

  it("adds a report and awards points", () => {
    const startReports = latestCtx!.reports.length;
    const startPoints = latestCtx!.user.points;
    const startCreated = latestCtx!.user.reports;

    act(() => {
      latestCtx!.addReport({
        title: "Нова локация",
        location: "Тест локация",
        severity: "low",
        points: 40,
      });
    });

    expect(latestCtx!.reports.length).toBe(startReports + 1);
    expect(latestCtx!.reports[0].status).toBe("open");
    expect(latestCtx!.user.points).toBe(startPoints + 15);
    expect(latestCtx!.user.reports).toBe(startCreated + 1);
  });

  it("claims and completes a report", () => {
    const target = latestCtx!.reports.find((r: any) => r.status === "open");
    expect(target).toBeTruthy();

    act(() => {
      latestCtx!.claimReport(target!.id);
    });
    expect(latestCtx!.reports.find((r: any) => r.id === target!.id)?.status).toBe(
      "in-progress",
    );

    const pointsBefore = latestCtx!.user.points;
    const cleansBefore = latestCtx!.user.cleanings;
    const targetPoints = latestCtx!.reports.find((r: any) => r.id === target!.id)!.points;

    act(() => {
      latestCtx!.completeReport(target!.id);
    });

    expect(latestCtx!.reports.find((r: any) => r.id === target!.id)?.status).toBe(
      "done",
    );
    expect(latestCtx!.user.points).toBe(pointsBefore + targetPoints);
    expect(latestCtx!.user.cleanings).toBe(cleansBefore + 1);
  });

  it("spends points but never below zero", () => {
    act(() => {
      latestCtx!.dispatch({ type: "SPEND_POINTS", payload: 999999 });
    });
    expect(latestCtx!.user.points).toBe(0);
  });

  it("adds and dismisses notifications", () => {
    act(() => {
      latestCtx!.dispatch({
        type: "ADD_NOTIFICATION",
        payload: { type: "info", message: "hello", duration: 1000 },
      });
    });
    expect(latestCtx!.notifications.length).toBeGreaterThan(0);

    const id = latestCtx!.notifications[0].id;
    act(() => {
      latestCtx!.dismissNotification(id);
    });
    expect(latestCtx!.notifications.find((n: any) => n.id === id)).toBeUndefined();
  });
});
