"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="cs">
      <head>
        <title>Kritická chyba | Španělština Brno</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#FBF9F6",
          fontFamily:
            "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1F1A17",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          {/* Error badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              color: "#E07B53",
              padding: "10px 20px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "32px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            Kritická chyba
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: "#E07B53" }}>Ay!</span> Něco se pokazilo
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#6B5D54",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            Omlouváme se, aplikace narazila na vážnou chybu. Zkuste prosím
            obnovit stránku nebo se vraťte později.
          </p>

          {/* Error icon */}
          <div
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 32px",
              background: "linear-gradient(135deg, #E07B53 0%, #C4613D 100%)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(211, 82, 51, 0.3)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#E07B53",
                color: "#FFFFFF",
                padding: "16px 32px",
                borderRadius: "9999px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 10px 30px rgba(211, 82, 51, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#C4613D";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#E07B53";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Zkusit znovu
            </button>

            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#FFFFFF",
                color: "#1F1A17",
                padding: "16px 32px",
                borderRadius: "9999px",
                fontSize: "16px",
                fontWeight: 600,
                border: "2px solid #EBE6DF",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#E07B53";
                e.currentTarget.style.color = "#E07B53";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#EBE6DF";
                e.currentTarget.style.color = "#1F1A17";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Hlavní stránka
            </a>
          </div>

          {/* Error digest */}
          {error.digest && (
            <p
              style={{
                marginTop: "32px",
                fontSize: "12px",
                color: "#6B5D54",
                opacity: 0.6,
              }}
            >
              Kód chyby: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
