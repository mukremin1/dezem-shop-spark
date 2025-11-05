import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Variant {
  id?: string;
  name: string;
  value: string;
  sku: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductVariantsProps {
  productId: string;
}

export const ProductVariants = ({ productId }: ProductVariantsProps) => {
  const { toast } = useToast();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    name: "",
    value: "",
    sku: "",
    price_adjustment: 0,
    stock_quantity: 0,
    is_active: true,
  });

  useEffect(() => {
    loadVariants();
  }, [productId]);

  const loadVariants = async () => {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Varyant yükleme hatası:", error);
      return;
    }

    if (data) {
      setVariants(data);
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.value) {
      toast({
        title: "Hata",
        description: "Varyant adı ve değeri gereklidir.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
      ...newVariant,
    });

    if (error) {
      toast({
        title: "Hata",
        description: "Varyant eklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı",
      description: "Varyant başarıyla eklendi.",
    });

    setNewVariant({
      name: "",
      value: "",
      sku: "",
      price_adjustment: 0,
      stock_quantity: 0,
      is_active: true,
    });

    loadVariants();
  };

  const handleDeleteVariant = async (variantId: string) => {
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", variantId);

    if (error) {
      toast({
        title: "Hata",
        description: "Varyant silinirken bir hata oluştu.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı",
      description: "Varyant başarıyla silindi.",
    });

    loadVariants();
  };

  const handleToggleActive = async (variantId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("product_variants")
      .update({ is_active: !currentStatus })
      .eq("id", variantId);

    if (error) {
      toast({
        title: "Hata",
        description: "Varyant güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
      return;
    }

    loadVariants();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ürün Varyantları</h3>

      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((variant) => (
            <Card key={variant.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm font-medium">{variant.name}</div>
                    <div className="text-sm text-muted-foreground">{variant.value}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">SKU</div>
                    <div className="text-muted-foreground">{variant.sku || "-"}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Fiyat Farkı</div>
                    <div className="text-muted-foreground">₺{variant.price_adjustment}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Stok</div>
                    <div className="text-muted-foreground">{variant.stock_quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={variant.is_active}
                      onCheckedChange={() => handleToggleActive(variant.id!, variant.is_active)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVariant(variant.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-4">Yeni Varyant Ekle</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Varyant Adı (Örn: Beden, Renk)</Label>
            <Input
              value={newVariant.name}
              onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              placeholder="Beden"
            />
          </div>
          <div>
            <Label>Değer (Örn: S, Kırmızı)</Label>
            <Input
              value={newVariant.value}
              onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
              placeholder="M"
            />
          </div>
          <div>
            <Label>SKU</Label>
            <Input
              value={newVariant.sku}
              onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              placeholder="SKU-123"
            />
          </div>
          <div>
            <Label>Fiyat Farkı (₺)</Label>
            <Input
              type="number"
              step="0.01"
              value={newVariant.price_adjustment}
              onChange={(e) =>
                setNewVariant({ ...newVariant, price_adjustment: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label>Stok</Label>
            <Input
              type="number"
              value={newVariant.stock_quantity}
              onChange={(e) =>
                setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Switch
                checked={newVariant.is_active}
                onCheckedChange={(checked) => setNewVariant({ ...newVariant, is_active: checked })}
              />
              <Label>Aktif</Label>
            </div>
          </div>
        </div>
        <Button onClick={handleAddVariant} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Varyant Ekle
        </Button>
      </Card>
    </div>
  );
};
