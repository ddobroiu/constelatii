import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { runLifecycle } from "@/lib/lifecycle/run";

export const dynamic = "force-dynamic";

/**
 * Cronul e-mailurilor, apelat de pe server la 15 minute (vezi DEPLOY.md):
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://constelatii.com/api/cron/emails
 * `?dry=1` doar numără ce ar pleca, pe feluri. `?limit=N` (1–50), implicit 50,
 * cu 600 ms între trimiteri.
 */

const MAX_BATCH = 50;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET ?? "";
  if (secret.length < 16) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const asked = Number(url.searchParams.get("limit"));
  const limit = Number.isInteger(asked) && asked > 0 ? Math.min(asked, MAX_BATCH) : MAX_BATCH;

  try {
    return NextResponse.json(await runLifecycle({ dry, limit }));
  } catch (error) {
    console.error("[cron/emails]", error);
    return NextResponse.json({ error: "Rularea a eșuat" }, { status: 500 });
  }
}
