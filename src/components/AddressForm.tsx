import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  userId: string;
  onCreated: (addr: any) => void;
};

export default function AddressForm({ userId, onCreated }: Props) {
  const [isCorporate, setIsCorporate] = useState(false);
  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isCorporate && !taxNumber.trim()) {
        setError("Kurumsal adres için vergi numarası gerekli.");
        setLoading(false);
        return;
      }

      const payload = {
        user_id: userId,
        is_corporate: isCorporate ?? false,
        label: label || null,
        street: street || null,
        city: city || null,
        postal_code: postalCode || null,
        country: country || null,
        phone: phone || null,
        tax_office: isCorporate ? (taxOffice || null) : null,
        tax_number: isCorporate ? (taxNumber || null) : null,
      };

      const { data, error } = await supabase.from("addresses").insert(payload).select().single();

      if (error) throw error;

      onCreated(data);
      setIsCorporate(false);
      setLabel("");
      setStreet("");
      setCity("");
      setPostalCode("");
      setCountry("");
      setPhone("");
      setTaxOffice("");
      setTaxNumber("");
    } catch (err: any) {
      console.error("Adres ekleme hatası:", err);
      setError(err.message || "Adres eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mb-4 border rounded bg-white">
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="flex items-center gap-4 mb-3">
        <label className="flex items-center gap-2">
          <input type="radio" name="addr-type" checked={!isCorporate} onChange={() => setIsCorporate(false)} />
          <span>Bireysel</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="addr-type" checked={isCorporate} onChange={() => setIsCorporate(true)} />
          <span>Kurumsal</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiket (ör. Ev, İş)"
          className="border rounded px-3 py-2"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon"
          className="border rounded px-3 py-2"
        />
        <input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Adres (sokak, bina)"
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Şehir"
          className="border rounded px-3 py-2"
        />
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Posta Kodu"
          className="border rounded px-3 py-2"
        />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Ülke"
          className="border rounded px-3 py-2"
        />
      </div>

      {isCorporate && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={taxOffice}
            onChange={(e) => setTaxOffice(e.target.value)}
            placeholder="Vergi Dairesi"
            className="border rounded px-3 py-2"
          />
          <input
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
            placeholder="Vergi Numarası"
            className="border rounded px-3 py-2"
          />
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-primary text-white rounded">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
