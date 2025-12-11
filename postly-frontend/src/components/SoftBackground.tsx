// src/components/SoftBackground.tsx
import React from "react";

type Props = {
  opacity?: number;
};

const SoftBackground: React.FC<Props> = ({ opacity = 0.45 }) => {
  return (
    <>
      {/* Main diagonal gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
          `,
          opacity,
        }}
      />

      {/* Center blurry glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "999px",
            background: "rgba(212, 109, 238, 0.35)",
            filter: "blur(70px)",
            top: -40,
            left: -160,
          }}
        />
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "999px",
            background: "rgba(69, 1, 255, 0.35)",
            filter: "blur(80px)",
            top: 120,
            left: 80,
          }}
        />
      </div>
    </>
  );
};

export default SoftBackground;
