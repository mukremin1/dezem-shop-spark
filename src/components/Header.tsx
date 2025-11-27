import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { MessageCircle, Mail } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false); // mobile menu open
  const [settingsOpen, setSettingsOpen] = useState(false); // collapsible settings inside menu
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore error but still try to redirect/refresh
    }
    navigate("/");
    setTimeout(() => window.location.reload(), 120);
  }

  // close menus on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close mobile menu
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!menuOpen) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold" style={{ color: "var(--color-primary, #ff6a00)" }}>
          Dezemu
        </Link>
      </div>

      {/* Mobilde tam genişlik, desktop'ta normal */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:w-auto gap-3 relative">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4 text-sm md:text-base items-center">
          <Link to="/" className="hover:text-blue-600">
            Anasayfa
          </Link>

          <Link to="/orders" className="hover:text-blue-600">
            Siparişlerim
          </Link>

          <a
            href="https://wa.me/905395263293?text=Merhaba%20Dezemu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600 flex items-center gap-1"
            title="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href="mailto:destek@dezemu.com"
            className="hover:text-blue-600 flex items-center gap-1"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </a>

          {loading ? (
            <span className="text-gray-500 ml-2">Yükleniyor...</span>
          ) : user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-blue-600">
                Profil
              </Link>
              <Link to="/addresses" className="hover:text-blue-600">
                Adreslerim
              </Link>

              <div className="relative">
                <button
                  onClick={() => setSettingsOpen((s) => !s)}
                  aria-expanded={settingsOpen}
                  aria-controls="header-settings-desktop"
                  className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                >
                  Ayarlar
                </button>
                {settingsOpen && (
                  <div
                    id="header-settings-desktop"
                    role="menu"
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-20"
                  >
                    <Link to="/settings/account" role="menuitem" className="block px-4 py-2 hover:bg-gray-50">
                      Hesap Ayarları
                    </Link>
                    <Link to="/settings/notifications" role="menuitem" className="block px-4 py-2 hover:bg-gray-50">
                      Bildirimler
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                aria-label="Çıkış yap"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Kayıt Ol
              </Link>
              <Link to="/login" className="ml-2 text-sm hover:text-blue-600">
                Giriş Yap
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger button */}
        <div className="md:hidden flex items-center">
          <button
            ref={buttonRef}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 rounded-md border"
            data-testid="hamburger-button"
          >
            <svg width="22" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="22" height="2" rx="1" fill="currentColor" y="0"></rect>
              <rect width="22" height="2" rx="1" fill="currentColor" y="7"></rect>
              <rect width="22" height="2" rx="1" fill="currentColor" y="14"></rect>
            </svg>
          </button>
        </div>

        {/* Mobile menu inline under hamburger (inside same Header.tsx) */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute left-4 right-4 top-full mt-3 z-50 bg-white border rounded shadow-md p-4 md:hidden"
            role="dialog"
            aria-modal="false"
            aria-label="Mobil menü"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2">
                Anasayfa
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2">
                Siparişlerim
              </Link>

              <a
                href="https://wa.me/905395263293?text=Merhaba%20Dezemu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>

              <a href="mailto:destek@dezemu.com" className="block py-2" onClick={() => setMenuOpen(false)}>
                destek@dezemu.com
              </a>

              {loading ? (
                <span className="text-gray-500">Yükleniyor...</span>
              ) : user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2">
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2">
                    Profil
                  </Link>
                  <Link to="/addresses" onClick={() => setMenuOpen(false)} className="block py-2">
                    Adreslerim
                  </Link>

                  {/* Settings collapsible inside mobile menu */}
                  <div>
                    <button
                      onClick={() => setSettingsOpen((s) => !s)}
                      aria-expanded={settingsOpen}
                      aria-controls="mobile-settings"
                      className="w-full text-left py-2 flex justify-between items-center"
                    >
                      <span>Ayarlar</span>
                      <span aria-hidden>{settingsOpen ? "▲" : "▼"}</span>
                    </button>
                    {settingsOpen && (
                      <div id="mobile-settings" className="pl-4">
                        <Link to="/settings/account" onClick={() => setMenuOpen(false)} className="block py-2">
                          Hesap Ayarları
                        </Link>
                        <Link to="/settings/notifications" onClick={() => setMenuOpen(false)} className="block py-2">
                          Bildirimler
                        </Link>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="mt-2 w-full text-left py-2 border rounded"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2">
                    Kayıt Ol
                  </Link>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2">
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
