import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spanelstina Brno",
    short_name: "Spanelstina",
    description: "Kurzy spanelstiny v Brne",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F6",
    theme_color: "#E07B53",
    icons: [
      {
        src: "/icons/icon-192x192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
