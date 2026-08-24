import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Fuck Plagiarism — plagiarism remover and AI detection tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/logo.png"));

export default function OpenGraphImage() {
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
          background: "#0f172a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -120,
            top: -140,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "rgba(167,139,250,0.35)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -140,
            bottom: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(56,189,248,0.25)",
            filter: "blur(120px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            width={72}
            height={72}
            alt=""
            style={{ borderRadius: 16 }}
          />
          <span style={{ color: "#e2e8f0", fontSize: 30, fontWeight: 600, letterSpacing: 1 }}>
            FUCK PLAGIARISM
          </span>
        </div>
        <div
          style={{
            marginTop: 36,
            color: "white",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          Make plagiarism disappear.
        </div>
        <div style={{ marginTop: 28, color: "#94a3b8", fontSize: 28 }}>
          Plagiarism remover · AI text &amp; image detection · Document support
        </div>
      </div>
    ),
    size,
  );
}
