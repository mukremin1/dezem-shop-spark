import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { Upload, Download } from "lucide-react";

export default function AdminUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Excel dosyasını JSON'a çevir
  const parseExcel = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
  };

  // JSON verisini Supabase'e toplu yükle
  const uploadToSupabase = async (jsonData: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    const batchSize = 50;

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const chunk = jsonData.slice(i, i + batchSize).map((row: any) => {
        const name = row["Ürün Adı"] || row["name"] || row["Name"] || "";
        const priceStr = row["Fiyat"] || row["price"] || row["Trendyol'da Satılacak Fiyat (KDV Dahil)"] || "0";
        const compareStr = row["Eski Fiyat"] || row["compare_price"] || row["Piyasa Satış Fiyatı (KDV Dahil)"] || null;

        return {
          name,
          slug: name.toLowerCase()
                    .replace(/ğ/g,"g").replace(/ü/g,"u")
                    .replace(/ş/g,"s").replace(/ı/g,"i")
                    .replace(/ö/g,"o").replace(/ç/g,"c")
                    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),
          price: parseFloat(priceStr) || 0,
          compare_price: compareStr ? parseFloat(compareStr) : null,
          description: row["Açıklama"] || row["description"] || row["Ürün Açıklaması"] || "",
          stock_quantity: parseInt(row["Stok"] || row["stock_quantity"] || row["Ürün Stok Adedi"] || "0"),
          sku: row["SKU"] || row["Model Kodu"] || row["Tedarikçi Stok Kodu"] || "",
          barcode: row["Barkod"] || "",
          is_active: true,
          is_featured: false,
          is_digital: false
        };
      });

      const cleanedChunk = chunk.map(item => 
        Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== null && v !== ""))
      );

      const { error } = await supabase.from("products").insert(cleanedChunk);
      if (error) {
        console.error("Batch insert error:", error);
        errorCount += chunk.length;
      } else {
        successCount += chunk.length;
      }
    }

    toast({
      title: "Yükleme Tamamlandı ✅",
      description: `${successCount} ürün başarıyla yüklendi. ${errorCount > 0 ? `${errorCount} ürün yüklenemedi.` : ""}`
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const jsonData = await parseExcel(file);
      await uploadToSupabase(jsonData);
    } catch (err) {
      console.error("File processing error:", err);
      toast({ title: "Hata", description: "Excel dosyası işlenirken hata oluştu.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAutoUpload = async () => {
    setIsUploading(true);
    try {
      const response = await fetch("/products-data.xlsx");
      if (!response.ok) throw new Error("Dosya bulunamadı!");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      await uploadToSupabase(jsonData);
    } catch (error) {
      console.error("Auto upload error:", error);
      toast({ title: "Hata", description: "products-data.xlsx bulunamadı veya okunamadı.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => window.open("/products-template.xlsx", "_blank");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ürün Yükleme</CardTitle>
          <CardDescription>Excel dosyasından ürünleri yükleyebilir veya otomatik yükleme yapabilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} className="w-full border p-2 rounded" />
          <Button variant="default" onClick={handleAutoUpload} disabled={isUploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" /> {isUploading ? "Yükleniyor..." : "Tüm Ürünleri Otomatik Yükle"}
          </Button>
          <Button variant="outline" onClick={downloadTemplate} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Excel Şablonunu İndir
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
