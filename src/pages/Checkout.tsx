import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "İsim en az 3 karakter olmalıdır").max(100),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası giriniz").max(20),
  address: z.string().trim().min(10, "Adres en az 10 karakter olmalıdır").max(500),
  city: z.string().trim().min(2, "Şehir giriniz").max(100),
  postalCode: z.string().trim().min(5, "Posta kodu giriniz").max(10),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "shopier">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    // Load user profile data
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setFormData({
              fullName: data.full_name || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              postalCode: data.postal_code || "",
            });
          }
        });
    }
  }, [user, authLoading, navigate, items.length]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      checkoutSchema.parse({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      });

      setIsSubmitting(true);

      // Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        })
        .eq("id", user!.id);

      if (profileError) throw profileError;

      const subtotal = getTotalPrice();
      const shippingCost = 39.99;
      const total = subtotal + shippingCost;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.fullName,
          customer_email: user!.email!,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_postal_code: formData.postalCode,
          payment_method: paymentMethod,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          total: total,
          order_number: `ORD-${Date.now()}`,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();

      toast({
        title: "Sipariş Alındı",
        description: `Sipariş numaranız: ${order.order_number}`,
      });

      // Redirect based on payment method
      if (paymentMethod === "bank") {
        navigate(`/order-success?orderId=${order.id}`);
      } else {
        // TODO: Redirect to Shopier payment
        toast({
          title: "Ödeme Sayfasına Yönlendiriliyor",
          description: "Shopier ödeme sayfasına yönlendiriliyorsunuz...",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Form Hatası",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Hata",
          description: "Sipariş oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = 39.99;
  const total = subtotal + shippingCost;

  if (authLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Sepete Dön
        </Button>

        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teslimat Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Ad Soyad *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adres *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Şehir *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Posta Kodu *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemi</h2>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "bank" | "shopier")}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Havale / EFT</div>
                        <div className="text-sm text-muted-foreground">
                          Sipariş sonrası banka bilgilerimizi göreceksiniz
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="shopier" id="shopier" />
                    <Label htmlFor="shopier" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Kredi Kartı (Shopier)</div>
                        <div className="text-sm text-muted-foreground">
                          Güvenli ödeme sayfasına yönlendirileceksiniz
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo</span>
                    <span>₺{shippingCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-primary">₺{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "İşleniyor..." : "Siparişi Tamamla"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
