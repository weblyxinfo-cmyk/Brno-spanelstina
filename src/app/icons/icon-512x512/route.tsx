import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 256,
          background: "linear-gradient(135deg, #C41E3A 0%, #B8432A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-5px",
        }}
      >
        ŠB
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
