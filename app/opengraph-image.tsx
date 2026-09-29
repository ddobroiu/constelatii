import { ImageResponse } from "next/og";
import { OG_IMAGE_ALT } from "@/lib/seo/metadata";

// Imaginea de partajare implicită (Open Graph / Twitter) pentru tot site-ul.
// Fontul implicit al ImageResponse (Geist) acoperă diacriticele românești.
export const alt = OG_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05060f 0%, #1b1640 100%)",
          color: "#f1f0ff",
        }}
      >
        <div style={{ fontSize: 34, color: "#a78bfa", marginBottom: 24 }}>constelatii.com</div>
        <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.1 }}>Constelații Familiale</div>
        <div style={{ fontSize: 38, marginTop: 28, color: "rgba(241,240,255,0.75)", lineHeight: 1.3 }}>
          Așază-ți familia pe o tablă interactivă și primește o interpretare personalizată.
        </div>
      </div>
    ),
    size,
  );
}
