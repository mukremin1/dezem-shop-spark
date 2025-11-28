import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";
import { MessageCircle, Mail, Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const ADMIN_EMAIL = "mukremin.cakmak.da@gmail.com";

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const [profileInfo, setProfileInfo] = useState<{
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    loading?: boolean;
  }>({ loading: false });

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore error but still try to redirect/refresh
    }
    navigate("/");
    setTimeout(() => window.location.reload(), 120);
  }

  // Load profile and latest address for the small header panel
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      if (!user) {
        setProfileInfo({ name: null, phone: null, address: null, loading: false });
        return;
      }
      setProfileInfo((s) => ({ ...(s ?? {}), loading: true }));
      try {
        let name: string | null = null;
        let phone: string | null = null;

        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .single();
          if (!profileError && profileData) {
            name = profileData.full_name ?? name;
            phone = profileData.phone ?? phone;
          }
        } catch {
          // ignore if table doesn't exist
        }

        try {
          const metaName = (user as any)?.user_metadata?.full_name ?? (user as any)?.user_metadata?.name ?? null;
          if (!name && metaName) name = metaName;
          if (!phone && (user as any)?.user_metadata?.phone) phone = (user as any).user_metadata.phone;
        } catch {}

        let addressText: string | null = null;
        try {
          const { data: addrData, error: addrError } = await supabase
            .from("addresses")
            .select("label,street,city,postal_code,country,phone")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          if (!addrError && addrData) {
            const parts = [
              addrData.label ? `${addrData.label}` : null,
              addrData.street ? `${addrData.street}` : null,
              addrData.city ? `${addrData.city}` : null,
              addrData.postal_code ? `${addrData.postal_code}` : null,
              addrData.country ? `${addrData.country}` : null,
            ].filter(Boolean);
            addressText = parts.join(", ") || null;
            if (!phone && addrData.phone) phone = addrData.phone;
          }
        } catch {
          // ignore if no table
        }

        if (mounted) {
          setProfileInfo({ name, phone, address: addressText, loading: false });
        }
      } catch (err) {
        if (mounted) setProfileInfo({ name: null, phone: null, address: null, loading: false });
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Close profile panel on outside click / Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(t) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(t)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [profileOpen]);

  const isAdminUser =
    !!user &&
    (user.email === ADMIN_EMAIL ||
      (user.user_metadata && ((user.user_metadata as any).email === ADMIN_EMAIL || (user.user_metadata as any).full_name === ADMIN_EMAIL)));

  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold" style={{ color: "var(--color-primary, #ff6a00)" }}>
          Dezemu
        </Link>
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:w-auto gap-3 relative">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4 text-sm md:text-base items-center">
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

              {isAdminUser && location.pathname === "/" && (
                <Link
                  to="/add-product"
                  title="Ürün Ekle"
                  className="ml-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white hover:bg-primary/90"
                  aria-label="Ürün Ekle"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              )}

              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileOpen((s) => !s)}
                  aria-expanded={profileOpen}
                  aria-controls="header-profile-panel"
                  className="hover:text-blue-600 px-1"
                >
                  Profil
                </button>

                {profileOpen && (
                  <div
                    id="header-profile-panel"
                    ref={profileRef}
                    role="dialog"
                    aria-label="Profil bilgileri"
                    className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-20 p-3 text-sm"
                  >
                    {profileInfo.loading ? (
                      <div>Yükleniyor...</div>
                    ) : (
                      <>
                        <div className="mb-2">
                          <div className="font-semibold">{profileInfo.name ?? (user?.email ?? "Kullanıcı")}</div>
                          {profileInfo.phone && <div className="text-sm">Tel: {profileInfo.phone}</div>}
                        </div>

                        <div className="mb-3">
                          <div className="font-medium">Adres</div>
                          <div className="text-sm text-muted-foreground">
                            {profileInfo.address ?? "Adres bilgisi yok."}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to="/profile" onClick={() => setProfileOpen(false)} className="px-2 py-1 border rounded text-xs">
                            Profil Sayfası
                          </Link>
                          <Link to="/addresses" onClick={() => setProfileOpen(false)} className="px-2 py-1 border rounded text-xs">
                            Adreslerim
                          </Link>
                        </div>
                      </>
                    )}
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
      </div>
    </header>
  );
};

export default Header;
