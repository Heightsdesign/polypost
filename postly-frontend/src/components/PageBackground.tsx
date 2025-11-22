import BgBlur from "../assets/blobs/bg-blur.png";
import BlobRed from "../assets/blobs/blob-1.png";
import BlobPurple from "../assets/blobs/blob-2.png";
import BlobYellow from "../assets/blobs/blob-3.png";
import BlobRedSmall from "../assets/blobs/red-dot.png";
import BlobYellowSmall from "../assets/blobs/yellow-dot.png";
import BlobPurpleLarge from "../assets/blobs/blob-6.png";
import BlobGreen from "../assets/blobs/blob-4.png";
import BlobBlue from "../assets/blobs/blob-7.png";

export default function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Lens gradient overlay */}
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

      {/* Background blur image */}
      <img
        src={BgBlur}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "2000px",
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* BLOBS */}
      <img src={BlobRed} alt="" className="pointer-events-none absolute" style={{
        top: "140px", left: "-160px", width: "380px", opacity: 0.75, zIndex: 0 }} />

      <img src={BlobPurple} alt="" className="pointer-events-none absolute" style={{
        top: "260px", right: "-260px", width: "420px", opacity: 0.75, zIndex: 0 }} />

      <img src={BlobYellow} alt="" className="pointer-events-none absolute" style={{
        bottom: "-160px", left: "50%", transform: "translateX(-50%)", width: "520px", opacity: 0.5 }} />

      <img src={BlobPurpleLarge} alt="" className="pointer-events-none absolute" style={{
        top: "-120px", right: "-150px", width: "500px", opacity: 0.35, transform: "rotate(-20deg)" }} />

      <img src={BlobYellowSmall} alt="" className="pointer-events-none absolute blob-float-slow" style={{
        top: "40px", left: "250px", width: "150px", opacity: 0.4 }} />

      <img src={BlobRedSmall} alt="" className="pointer-events-none absolute" style={{
        bottom: "-60px", left: "-20px", width: "200px", opacity: 0.8 }} />

      <img src={BlobBlue} alt="" className="pointer-events-none absolute" style={{
        bottom: "-150px", left: "120px", width: "450px", opacity: 0.8, transform: "rotate(4deg)" }} />

      <img src={BlobGreen} alt="" className="pointer-events-none absolute" style={{
        bottom: "-220px", right: "-260px", width: "520px", opacity: 0.8, transform: "rotate(-8deg)" }} />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}
