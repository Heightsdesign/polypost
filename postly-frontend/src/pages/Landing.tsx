// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import Logo from "../assets/logo/logo-complete-color-wide.png";

import BlobRed from "../assets/blobs/blob-1.png";
import BlobPurple from "../assets/blobs/blob-2.png";
import BlobYellow from "../assets/blobs/blob-3.png";
import BlobRedSmall from "../assets/blobs/red-dot.png";
import BlobYellowSmall from "../assets/blobs/yellow-dot.png";
import BlobPurpleLarge from "../assets/blobs/blob-6.png";
import BlobOrange from "../assets/blobs/blob-3.png";
import BlobGreen from "../assets/blobs/blob-4.png";
import BlobPurpleDot from "../assets/blobs/blob-6.png";
import BlobRedLarge from "../assets/blobs/blob-1.png";
import BlobBlue from "../assets/blobs/blob-7.png";
import BgBlur from "../assets/blobs/bg-blur.png";

import { useLanguage } from "../i18n/LanguageContext";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Diagonal lens gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
              radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.16), transparent 60%),
              radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
            `,
          opacity: 0.25,
        }}
      />

      <img
        src={BgBlur}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "2000px",
          height: "auto",
          zIndex: 0,
          opacity: 0.2,
        }}
      />

      {/* Playful background blobs as images */}
      <img
        src={BlobRed}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "140px",
          left: "-160px",
          width: "380px",
          height: "auto",
          opacity: 0.75,
          zIndex: 0,
        }}
      />

      <img
        src={BlobPurple}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "260px",
          right: "-260px",
          width: "420px",
          height: "auto",
          opacity: 0.75,
          zIndex: 0,
        }}
      />

      <img
        src={BlobYellow}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-160px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "520px",
          height: "auto",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <img
        src={BlobPurpleLarge}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "-120px",
          right: "-150px",
          width: "500px",
          height: "auto",
          opacity: 0.35,
          transform: "rotate(-20deg)",
          zIndex: 0,
        }}
      />

      {/* Small yellow dot, top-left */}
      <img
        src={BlobYellowSmall}
        alt=""
        className="pointer-events-none absolute blob-float-slow"
        style={{
          top: "40px",
          left: "250px",
          width: "150px",
          height: "auto",
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Small red dot, bottom-left */}
      <img
        src={BlobRedSmall}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-60px",
          left: "-20px",
          width: "200px",
          height: "auto",
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      <img
        src={BlobOrange}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "-200px",
          left: "-240px",
          width: "460px",
          height: "auto",
          opacity: 0.8,
          transform: "rotate(18deg)",
          zIndex: 0,
        }}
      />

      {/* Big green blob bottom-right */}
      <img
        src={BlobGreen}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-220px",
          right: "-260px",
          width: "520px",
          height: "auto",
          opacity: 0.8,
          transform: "rotate(-8deg)",
          zIndex: 0,
        }}
      />

      {/* Medium purple blob mid-left */}
      <img
        src={BlobPurpleDot}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "360px",
          left: "-40px",
          width: "200px",
          height: "auto",
          opacity: 0.8,
          zIndex: 0,
          transform: "rotate(12deg)",
        }}
      />

      {/* Large red blob behind bottom hero card */}
      <img
        src={BlobRedLarge}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-120px",
          right: "200px",
          width: "380px",
          height: "auto",
          opacity: 0.8,
          transform: "rotate(16deg)",
          zIndex: 0,
        }}
      />

      {/* Bottom-left blue blob */}
      <img
        src={BlobBlue}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-150px",
          left: "120px",
          width: "450px",
          height: "auto",
          opacity: 0.8,
          transform: "rotate(4deg)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* LOGO */}
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
          <div className="pt-16 flex justify-center">
            <img
              src={Logo}
              alt={t("landing_logo_alt")}
              className="block max-w-[140px] h-auto mb-6"
            />
          </div>

          {/* HERO BLOCK */}
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="mt-8 grid gap-12 md:grid-cols-[1.2fr,1fr] items-center">
              {/* LEFT COLUMN WITH BLOBS */}
              <div className="relative">
                {/* pink blob behind top-left of text */}
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -300,
                    width: 220,
                    height: 220,
                    borderRadius: "999px",
                    background: "rgba(212, 109, 238, 0.5)",
                    filter: "blur(40px)",
                  }}
                />

                {/* purple blob behind bottom-right of text */}
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    bottom: -100,
                    right: 80,
                    width: 240,
                    height: 240,
                    borderRadius: "999px",
                    background: "rgba(69, 1, 255, 0.5)",
                    filter: "blur(40px)",
                  }}
                />

                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3">
                  {t("landing_tagline")}
                </p>

                <h1 className="hero-title mb-4">
                  {t("landing_title_main")}{" "}
                  <span className="text-purple">
                    {t("landing_title_highlight")}
                  </span>
                </h1>

                <p className="hero-text mt-2 text-left md:text-left">
                  {t("landing_subtitle")}
                </p>

                {/* Main actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-semibold 
                              text-white hover:text-white 
                              bg-gradient-to-r from-purple to-pink 
                              shadow-lg shadow-purple/30 
                              hover:shadow-purple/40 
                              hover:translate-y-[-1px] active:translate-y-0 
                              transition-all"
                  >
                    {t("landing_login_cta")}
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-semibold border border-purple/30 text-purple bg-white/90 backdrop-blur hover:bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    {t("landing_register_cta")}
                  </Link>
                </div>
              </div>

              {/* RIGHT: Dashboard-style preview card */}
              <aside className="hidden md:block">
                <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-purple/10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-2xl bg-purple/10 flex items-center justify-center text-lg">
                        📊
                      </span>
                      <div>
                        <p className="text-xs text-dark/60 font-medium">
                          {t("landing_overview_label")}
                        </p>
                        <p className="text-sm font-semibold text-dark">
                          {t("landing_overview_title")}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-teal/10 text-teal font-medium">
                      {t("landing_overview_badge")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <StatPill
                      label={t("landing_stats_ideas")}
                      value="18"
                      color="purple"
                    />
                    <StatPill
                      label={t("landing_stats_drafts")}
                      value="7"
                      color="yellow"
                    />
                    <StatPill
                      label={t("landing_stats_scheduled")}
                      value="12"
                      color="teal"
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <SkeletonLine width="80%" />
                    <SkeletonLine width="65%" />
                    <SkeletonLine width="90%" />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatPillProps = {
  label: string;
  value: string;
  color: "purple" | "yellow" | "teal";
};

function StatPill({ label, value, color }: StatPillProps) {
  const colorMap: Record<StatPillProps["color"], string> = {
    purple: "bg-purple/10 text-purple",
    yellow: "bg-yellow/10 text-yellow-600",
    teal: "bg-teal/10 text-teal",
  };

  return (
    <div
      className={`rounded-2xl px-3 py-2 text-xs font-semibold flex flex-col gap-1 ${colorMap[color]}`}
    >
      <span className="opacity-80">{label}</span>
      <span className="text-base leading-none">{value}</span>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return <div className="h-2 rounded-full bg-purple/5" style={{ width }} />;
}
