// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo/logo-font-black-wide.png";
import api, { setAuthToken } from "../api";

type UserInfo = {
  username: string | null;
  email: string | null;
};

function decodeJwt(token: string): UserInfo | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);

    const username =
      (data.username as string | undefined) ??
      (data.user_name as string | undefined) ??
      null;
    const email =
      (data.email as string | undefined) ??
      (data.user_email as string | undefined) ??
      null;

    return { username, email };
  } catch {
    return null;
  }
}

export default function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Re-check token + profile on route changes
  useEffect(() => {
    const token = localStorage.getItem("postly_token");
    if (!token) {
      setHasToken(false);
      setUser(null);
      setAvatarUrl(null);
      return;
    }

    setHasToken(true);
    const info = decodeJwt(token);
    if (info) {
      setUser(info);
    } else {
      setUser({ username: null, email: null });
    }

    // Fetch creator profile (including avatar)
    (async () => {
      try {
        const res = await api.get("/auth/me/profile/");
        setAvatarUrl(res.data.avatar || null);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setAvatarUrl(null);
      }
    })();
  }, [loc.pathname]);

  // Close dropdown when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  const isLoggedIn = hasToken;
  const displayName = user?.username || "Account";

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setHasToken(false);
    setAvatarUrl(null);
    navigate("/login");
  };

  const isUseCases = loc.pathname.startsWith("/use-cases");
  const isPricing = loc.pathname.startsWith("/pricing");

  return (
    <nav className="sticky top-0 z-30 border-b border-purple/10 bg-offwhite/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center">
        {/* LEFT: logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Polypost logo"
              className="h-7 w-auto md:h-8"
            />
          </Link>
        </div>

        {/* CENTER: nav links */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/use-cases"
              className={
                isUseCases
                  ? "text-purple font-semibold"
                  : "text-dark/70 hover:text-purple transition-colors"
              }
            >
              Use cases
            </Link>
            <Link
              to="/pricing"
              className={
                isPricing
                  ? "text-purple font-semibold"
                  : "text-dark/70 hover:text-purple transition-colors"
              }
            >
              Pricing
            </Link>
          </div>
        </div>

        {/* RIGHT: auth / account dropdown */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-xs md:text-sm font-semibold text-dark/80 hover:text-purple transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-xs md:text-sm font-semibold text-dark shadow-sm hover:border-purple/40 hover:shadow-md transition-all"
              >
                {/* Avatar / initial */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple/15 text-[0.8rem] font-bold text-purple overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-7 w-7 object-cover rounded-full"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs md:text-sm">
                    {displayName}
                  </span>
                  {user?.email && (
                    <span className="hidden md:block text-[0.7rem] text-dark/55 max-w-[180px] truncate">
                      {user.email}
                    </span>
                  )}
                </div>
                <span className="text-[0.7rem] text-dark/50">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-purple/15 bg-white/95 shadow-lg text-xs md:text-sm py-2">
                  <DropdownItem to="/dashboard" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem to="/account" onClick={() => setMenuOpen(false)}>
                    Account
                  </DropdownItem>
                  <DropdownItem to="/gallery" onClick={() => setMenuOpen(false)}>
                    Gallery
                  </DropdownItem>

                  {/* NEW SUPPORT LINK */}
                  <DropdownItem to="/support" onClick={() => setMenuOpen(false)}>
                    Support
                  </DropdownItem>

                  <div className="my-1 border-t border-purple/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-[0.78rem] md:text-xs text-red-500 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

type DropdownItemProps = {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
};

function DropdownItem({ to, onClick, children }: DropdownItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 text-[0.78rem] md:text-xs text-dark/80 hover:bg-purple/5"
    >
      {children}
    </Link>
  );
}
