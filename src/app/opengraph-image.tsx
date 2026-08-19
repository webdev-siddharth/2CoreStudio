import { ImageResponse } from "next/og";

export const alt = "2coreStudio";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1428",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", gap: 40, marginBottom: 40 }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 9999,
              background: "#FF4FA0",
              border: "6px solid #EDE6F5",
            }}
          />
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 9999,
              background: "#FFA05C",
              border: "6px solid #EDE6F5",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: "#EDE6F5",
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          2CORE<span style={{ color: "#FF4FA0" }}>STUDIO</span>
        </div>
        <div style={{ fontSize: 28, color: "#B3A4CC", marginTop: 16 }}>
          EVERY PLATFORM · ONE STUDIO
        </div>
      </div>
    ),
    size
  );
}
