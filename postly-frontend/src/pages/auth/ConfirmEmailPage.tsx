import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../api";

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      setMessage("Invalid confirmation link.");
      return;
    }

    (async () => {
      try {
        const res = await api.post("/auth/confirm-email/", { uid, token });
        setStatus("ok");
        setMessage(res.data.detail || "Email confirmed! You can now log in.");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("This confirmation link is invalid or has expired.");
      }
    })();
  }, [searchParams]);

  const colorClass =
    status === "ok"
      ? "text-teal-700"
      : status === "error"
      ? "text-red-600"
      : "text-dark/70";

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-offwhite px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-purple/10 px-6 py-8">
        <h1 className="text-xl font-extrabold text-dark mb-3">
          {status === "loading" && "Confirming…"}
          {status === "ok" && "Email confirmed 🎉"}
          {status === "error" && "Confirmation issue"}
        </h1>

        <p className={`text-sm mb-5 ${colorClass}`}>{message}</p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
