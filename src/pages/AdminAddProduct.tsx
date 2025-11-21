import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

type ProductInput = {
  name: string;
  short_description?: string | null;
  price: number;
  image_url?: string | null;
};

type RawRow = Record<string, any>;

const ADMIN_EMAILS: string[] =
  ((import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined)
    ?.split(",")
    .map((s: string) => s.trim().toLowerCase()) || [];

function pickField(row: RawRow, keys: string[]) {
  const lowerRow: Record<string, any> = {};
  Object.keys(row).forEach((k) => (lowerRow[k.toLowerCase()] = row[k]));
  for (const k of keys) {
    if (lowerRow[k.toLowerCase()] != null && String(lowerRow[k.toLowerCase()]).toString().trim() !== "") {
      return String(lowerRow[k.toLowerCase()]).trim();
    }
  }
  return undefined;
}

async function parseExcelFile(file: File): Promise<RawRow[]> {
  // dynamic import so the app still runs if xlsx isn't installed until used
  const XLSX = await import("xlsx");
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const json: RawRow[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return json;
}

function parseXmlToRows(xmlText: string): RawRow[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  // check for parsererror
  if (doc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("XML parse error");
  }
  const productNodes = Array.from(doc.getElementsByTagName("product"));
  const rows: RawRow[] = productNodes.map((p) => {
    const obj: RawRow = {};
    // take child elements as keys
    Array.from(p.children).forEach((c) => {
      obj[c.tagName.toLowerCase()] = c.textContent ?? "";
    });
    // also try attributes on product node
    if (p.attributes) {
      Array.from(p.attributes).forEach((attr) => {
        obj[attr.name.toLowerCase()] = attr.value;
      });
    }
    return obj;
  });
  return rows;
}

function mapRawRowToProduct(row: RawRow): ProductInput | null {
  const name =
    pickField(row, ["name", "product", "title", "product_name"]) ?? "";
  const short_description =
    pickField(row, ["short_description", "description", "desc", "details"]) ??
    null;
  const priceStr = pickField(row, ["price", "cost", "fiyat", "amount"]) ?? "";
  const price = parseFloat(priceStr.toString().replace(",", "."));
  const image_url =
    pickField(row, ["image_url", "image", "img", "picture", "imageurl"]) ?? null;

  if (!name || Number.isNaN(price)) {
    // invalid row, skip
    return null;
  }
  return {
    name,
    short_description,
    price,
    image_url,
  };
}

export default function AdminAddProduct() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [filePreviewRows, setFilePreviewRows] = useState<ProductInput[]>([]);
  const [xmlPreviewRows, setXmlPreviewRows] = useState<ProductInput[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [xmlUrl, setXmlUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn("getUser error:", error);
        }
        const user = data?.user ?? null;
        const email = user?.email ?? null;
        setUserEmail(email);
        if (email && ADMIN_EMAILS.length > 0) {
          setIsAdmin(ADMIN_EMAILS.includes(email.toLowerCase()));
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (f?: File) => {
    setError(null);
    setSuccess(null);
    setFilePreviewRows([]);
    if (!f) return;
    setParsing(true);
    try {
      const rawRows = await parseExcelFile(f);
      const mapped = rawRows
        .map(mapRawRowToProduct)
        .filter((r): r is ProductInput => r !== null);
      if (mapped.length === 0) {
        setError("Hiç geçerli satır bulunamadı. Excel sütun adlarını kontrol edin.");
      } else {
        setFilePreviewRows(mapped);
      }
    } catch (err: any) {
      console.error("Excel parse error:", err);
      setError(err?.message || "Excel dosyası okunamadı.");
    } finally {
      setParsing(false);
    }
  };

  const handleXmlFetch = async () => {
    setError(null);
    setSuccess(null);
    setXmlPreviewRows([]);
    if (!xmlUrl.trim()) {
      setError("XML linki boş.");
      return;
    }
    setParsing(true);
    try {
      const res = await fetch(xmlUrl);
      if (!res.ok) throw new Error(`XML fetch failed: ${res.status}`);
      const text = await res.text();
      const rawRows = parseXmlToRows(text);
      const mapped = rawRows
        .map(mapRawRowToProduct)
        .filter((r): r is ProductInput => r !== null);
      if (mapped.length === 0) {
        setError("XML içinden geçerli ürün bulunamadı. XML formatını kontrol edin.");
      } else {
        setXmlPreviewRows(mapped);
      }
    } catch (err: any) {
      console.error("XML parse/fetch error:", err);
      setError(err?.message || "XML alınırken hata oluştu.");
    } finally {
      setParsing(false);
    }
  };

  const bulkInsert = async (items: ProductInput[]) => {
    setError(null);
    setSuccess(null);
    if (items.length === 0) {
      setError("Eklenecek ürün yok.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: insertError } = await supabase
        .from("products")
        .insert(items)
        .select();
      if (insertError) throw insertError;
      setSuccess(`${(data ?? []).length} ürün başarıyla eklendi.`);
      // clear previews
      setFilePreviewRows([]);
      setXmlPreviewRows([]);
    } catch (err: any) {
      console.error("Bulk insert error:", err);
      setError(err?.message || "Ürünler eklenirken hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) return <div className="p-6">Yükleniyor...</div>;
  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Yetkisiz</h1>
        <p className="text-gray-600">
          Bu sayfayı görme yetkiniz yok. Oturum açmış kullanıcı: {userEmail ?? "yok"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold mb-4">Ürün Ekleme (Admin) — Excel / XML ile</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Tekli ürün ekleme</h2>
        <p className="text-sm text-gray-500 mb-3">
          Hâlihazırdaki formu kullanmak istiyorsanız önceki tekli ekleme formunu kullanabilirsiniz (bu sayfada
          ayrıca Excel / XML ile toplu ekleme desteği de var).
        </p>
        {/* keep a small inline single-add form for convenience */}
        <SingleAddForm onAdded={(msg) => setSuccess(msg)} />
      </section>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Excel ile toplu yükleme</h2>
        <p className="text-sm text-gray-500 mb-2">
          Desteklenen sütun adları (büyük/küçük harf farketmez): name, product, title; price, cost; short_description,
          description; image_url, image. Excel (.xlsx/.xls/.csv) yükleyin, önizleyin ve ardından "İçe Aktar" ile yükleyin.
        </p>

        <div className="flex items-center gap-3 mb-3">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="border rounded px-2 py-1"
          />
          {parsing && <div className="text-sm text-gray-500">Okunuyor...</div>}
        </div>

        {filePreviewRows.length > 0 && (
          <>
            <div className="mb-3 text-sm text-gray-600">{filePreviewRows.length} satır önizlendi.</div>
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Ad</th>
                    <th className="p-2 border">Açıklama</th>
                    <th className="p-2 border">Fiyat</th>
                    <th className="p-2 border">Görsel</th>
                  </tr>
                </thead>
                <tbody>
                  {filePreviewRows.map((r, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{r.name}</td>
                      <td className="p-2 border">{r.short_description ?? "-"}</td>
                      <td className="p-2 border">₺{Number(r.price).toFixed(2)}</td>
                      <td className="p-2 border">{r.image_url ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => bulkInsert(filePreviewRows)}
                disabled={submitting}
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {submitting ? "Yükleniyor..." : "Excel'den İçe Aktar"}
              </button>

              <button
                onClick={() => setFilePreviewRows([])}
                className="border px-4 py-2 rounded"
                disabled={submitting}
              >
                Önizlemeyi Temizle
              </button>
            </div>
          </>
        )}
      </section>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">XML linki ile toplu yükleme</h2>
        <p className="text-sm text-gray-500 mb-2">
          XML formatı örneği:
        </p>
        <pre className="text-xs bg-gray-50 p-2 rounded mb-2 overflow-auto">
{`<products>
  <product>
    <name>Spor Ayakkabı</name>
    <short_description>Hafif ve rahat</short_description>
    <price>49.99</price>
    <image_url>https://...</image_url>
  </product>
  ...
</products>`}
        </pre>

        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={xmlUrl}
            onChange={(e) => setXmlUrl(e.target.value)}
            placeholder="https://example.com/products.xml"
            className="border rounded px-3 py-2 flex-1"
          />
          <button onClick={handleXmlFetch} className="bg-primary text-white px-3 py-2 rounded">
            XML Getir & Önizle
          </button>
        </div>

        {xmlPreviewRows.length > 0 && (
          <>
            <div className="mb-3 text-sm text-gray-600">{xmlPreviewRows.length} öğe önizlendi.</div>

            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Ad</th>
                    <th className="p-2 border">Açıklama</th>
                    <th className="p-2 border">Fiyat</th>
                    <th className="p-2 border">Görsel</th>
                  </tr>
                </thead>
                <tbody>
                  {xmlPreviewRows.map((r, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{r.name}</td>
                      <td className="p-2 border">{r.short_description ?? "-"}</td>
                      <td className="p-2 border">₺{Number(r.price).toFixed(2)}</td>
                      <td className="p-2 border">{r.image_url ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => bulkInsert(xmlPreviewRows)}
                disabled={submitting}
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {submitting ? "Yükleniyor..." : "XML'den İçe Aktar"}
              </button>

              <button onClick={() => setXmlPreviewRows([])} className="border px-4 py-2 rounded">
                Önizlemeyi Temizle
              </button>
            </div>
          </>
        )}
      </section>

      <div className="pt-4">
        <button onClick={() => navigate(-1)} className="border px-4 py-2 rounded">
          Geri
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   SingleAddForm component
   small inline form to add single product (keeps backward compatibility)
   ------------------------- */
function SingleAddForm({ onAdded }: { onAdded?: (msg: string) => void }) {
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    price: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim()) return setErr("Ürün adı gerekli.");
    if (!form.price.trim() || isNaN(Number(form.price))) return setErr("Geçerli bir fiyat girin.");
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        short_description: form.short_description.trim() || null,
        price: Number(form.price),
        image_url: form.image_url.trim() || null,
      };
      const { data, error } = await supabase.from("products").insert([payload]).select().maybeSingle();
      if (error) throw error;
      onAdded?.("Ürün eklendi.");
      setForm({ name: "", short_description: "", price: "", image_url: "" });
    } catch (err: any) {
      console.error(err);
      setErr(err?.message || "Ekleme hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-2">
      {err && <div className="text-red-600">{err}</div>}
      <div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ürün adı"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <textarea
          name="short_description"
          value={form.short_description}
          onChange={handleChange}
          placeholder="Kısa açıklama"
          className="w-full border rounded px-3 py-2"
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Fiyat"
          className="w-32 border rounded px-3 py-2"
        />
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Görsel URL"
          className="flex-1 border rounded px-3 py-2"
        />
      </div>
      <div>
        <button className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Ürünü Ekle"}
        </button>
      </div>
    </form>
  );
}
