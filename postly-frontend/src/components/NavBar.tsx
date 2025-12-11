// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo/logo-font-black-wide.png";
import Emblem from "../assets/logo/logo-emblem-color-wide.png";
import api, { setAuthToken } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import type { SupportedLang } from "../i18n/translations";

type UserInfo = {
  username: string | null;
  email: string | null;
};

type NotificationItem = {
  id: number | string;
  kind?: string;
  message: string;
  created_at: string;
  is_read: boolean;
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

  // 🔔 notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const { lang, t, setLang } = useLanguage();

  // Re-check token + profile on route changes
  useEffect(() => {
    const token = localStorage.getItem("postly_token");
    if (!token) {
      setHasToken(false);
      setUser(null);
      setAvatarUrl(null);
      setNotifications([]);
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

  // Load notifications when user is logged in
  useEffect(() => {
    if (!hasToken) {
      setNotifications([]);
      return;
    }

    (async () => {
      try {
        setNotifLoading(true);
        const res = await api.get("/notifications/");
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setNotifLoading(false);
      }
    })();
  }, [hasToken]);

  // Close dropdowns when route changes
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [loc.pathname]);

  const isLoggedIn = hasToken;
  const displayName = user?.username || t("navbar_account_fallback");

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setHasToken(false);
    setAvatarUrl(null);
    setNotifications([]);
    navigate("/login");
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLang;
    setLang(newLang, { persist: true, syncProfile: isLoggedIn });
  };

  const isUseCases = loc.pathname.startsWith("/use-cases");
  const isPricing = loc.pathname.startsWith("/pricing");

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleNotificationBellClick() {
    setNotifOpen((prev) => !prev);
    setMenuOpen(false);
  }

  function handleNotificationClick(item: NotificationItem) {
    // For now: just mark as read locally so the badge shrinks
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === item.id
          ? {
              ...n,
              is_read: true,
            }
          : n
      )
    );
    // You could also navigate or open a detail modal here if you want
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-purple/10 bg-offwhite/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center">
        {/* LEFT: logo + emblem */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Emblem}
              alt={t("navbar_logo_alt")}
              className="h-7 w-auto md:h-8"
            />
            <img
              src={Logo}
              alt={t("navbar_logo_alt")}
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
              {t("navbar_use_cases")}
            </Link>
            <Link
              to="/pricing"
              className={
                isPricing
                  ? "text-purple font-semibold"
                  : "text-dark/70 hover:text-purple transition-colors"
              }
            >
              {t("navbar_pricing")}
            </Link>
          </div>
        </div>

        {/* RIGHT: language + notifications + auth / account dropdown */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Language selector */}
          <div className="hidden sm:inline-flex items-center">
            <label className="sr-only" htmlFor="navbar-language">
              {t("navbar_language")}
            </label>
            <select
              id="navbar-language"
              value={lang}
              onChange={handleLanguageChange}
              className="rounded-2xl border border-purple/20 bg-white/80 px-2 py-1 text-[0.7rem] md:text-xs text-dark/80 hover:border-purple/40 focus:outline-none focus:ring-1 focus:ring-purple/40"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={handleNotificationBellClick}
                className="relative mr-1 inline-flex items-center justify-center h-9 w-9 rounded-full border border-purple/15 bg-white/90 text-xs shadow-sm hover:border-purple/40 hover:shadow-md transition-all"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-pink text-[10px] text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-purple/15 bg-white/95 shadow-lg text-xs md:text-sm py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 pb-2 flex items-center justify-between">
                    <span className="font-semibold text-dark">
                      {t("navbar_notifications_title")}
                    </span>
                    {notifLoading && (
                      <span className="text-[10px] text-dark/50">
                        {t("navbar_notifications_loading")}
                      </span>
                    )}
                  </div>

                  {notifications.length === 0 && !notifLoading && (
                    <div className="px-3 py-2 text-[0.8rem] text-dark/70">
                      {t("navbar_notifications_empty")}
                    </div>
                  )}

                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 transition-colors ${
                        n.is_read
                          ? "bg-transparent hover:bg-purple/5"
                          : "bg-purple/5 hover:bg-purple/10"
                      }`}
                    >
                      <span className="text-[0.8rem] text-dark/90">
                        {n.message}
                      </span>
                      <span className="text-[0.7rem] text-dark/50">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-xs md:text-sm font-semibold text-dark/80 transition-colors"
              >
                {t("navbar_login")}
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold 
                          text-white hover:text-white 
                          bg-gradient-to-r from-purple to-pink 
                          shadow-md shadow-purple/30 
                          hover:shadow-purple/40 
                          hover:translate-y-[-1px] active:translate-y-0 
                          transition-all"
              >
                {t("navbar_get_started")}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen((o) => !o);
                  setNotifOpen(false);
                }}
                className="group flex items-center gap-2 rounded-2xl border border-purple/15 
                          bg-white/90 px-3 py-2 text-xs md:text-sm font-semibold text-dark 
                          shadow-sm hover:border-purple/40 hover:bg-purple/90 hover:text-white hover:shadow-md 
                          transition-all"
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
                  <span className="text-xs md:text-sm group-hover:text-white transition-colors">
                    {displayName}
                  </span>

                  {user?.email && (
                    <span className="hidden md:block text-[0.7rem] text-dark/55 group-hover:text-white/90 max-w-[180px] truncate transition-colors">
                      {user.email}
                    </span>
                  )}
                </div>

                <span className="text-[0.7rem] text-dark/50 group-hover:text-white/80 transition-colors">
                  ▾
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-purple/15 bg-white/95 shadow-lg text-xs md:text-sm py-2">
                  <DropdownItem
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("navbar_dashboard")}
                  </DropdownItem>
                  <DropdownItem
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("navbar_account")}
                  </DropdownItem>
                  <DropdownItem
                    to="/gallery"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("navbar_gallery")}
                  </DropdownItem>

                  <DropdownItem
                    to="/support"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("navbar_support")}
                  </DropdownItem>

                  <div className="my-1 border-t border-purple/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-[0.78rem] md:text-xs 
                              text-white hover:text-dark/80 hover:bg-purple/5 
                              transition-colors rounded-xl"
                  >
                    {t("navbar_logout")}
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
  children: ReactNode;
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
