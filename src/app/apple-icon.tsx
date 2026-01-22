import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "linear-gradient(135deg, #E07B53 0%, #B8432A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          borderRadius: "36px",
          letterSpacing: "-2px",
        }}
      >
        ŠB
      </div>
    ),
    {
      ...size,
    }
  );
}
