import { NextResponse } from "next/server";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "5");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ConstelatiiFamiliale/1.0 (+https://github.com/ddobroiu/constelatii)",
        "Accept-Language": "ro",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Căutarea locului a eșuat." }, { status: 502 });
    }

    const data: NominatimResult[] = await res.json();
    const results = data.map((r) => ({
      label: r.display_name,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Eroare la geocodare:", err);
    return NextResponse.json({ error: "Căutarea locului a eșuat." }, { status: 502 });
  }
}
