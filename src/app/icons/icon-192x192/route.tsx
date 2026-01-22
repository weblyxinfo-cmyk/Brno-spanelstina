import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "linear-gradient(135deg, #E07B53 0%, #B8432A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-2px",
        }}
      >
        ŠB
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
