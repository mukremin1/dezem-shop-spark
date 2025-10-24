import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Sık Sorulan Sorular</h1>
            <p className="text-lg text-muted-foreground">
              En çok merak edilen sorular ve cevapları
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Nasıl sipariş verebilirim?</AccordionTrigger>
              <AccordionContent>
                Sipariş vermek için önce üye olmanız gerekmektedir. Üye olduktan sonra beğendiğiniz 
                ürünleri sepete ekleyip ödeme adımına geçebilirsiniz. Ödeme işlemini tamamladıktan 
                sonra siparişiniz hazırlanmaya başlanacaktır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Hangi ödeme yöntemlerini kabul ediyorsunuz?</AccordionTrigger>
              <AccordionContent>
                Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz 
                güvenli ödeme altyapımız sayesinde korunmaktadır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Kargo ücreti ne kadar?</AccordionTrigger>
              <AccordionContent>
                Kargo ücreti bölgeye ve ürün ağırlığına göre değişmektedir. Sepet sayfasında kargo 
                ücretinizi görebilirsiniz. Belirli bir tutar üzeri alışverişlerde kargo ücretsizdir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Siparişim ne zaman kargoya verilir?</AccordionTrigger>
              <AccordionContent>
                Siparişiniz onaylandıktan sonra 1-2 iş günü içerisinde kargoya verilir. Kargo 
                takip numaranız e-posta adresinize gönderilecektir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>İade ve değişim nasıl yapılır?</AccordionTrigger>
              <AccordionContent>
                Ürünü teslim aldıktan sonra 14 gün içinde iade veya değişim talebinde bulunabilirsiniz. 
                Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir. İade işlemleri için 
                müşteri hizmetleri ile iletişime geçebilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>İade bedelim ne zaman hesabıma geçer?</AccordionTrigger>
              <AccordionContent>
                İade ettiğiniz ürün tarafımıza ulaştıktan ve kontrol edildikten sonra 3-5 iş günü 
                içerisinde iade bedeliniz hesabınıza/kartınıza iade edilir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Üyelik ücretsiz mi?</AccordionTrigger>
              <AccordionContent>
                Evet, üyelik tamamen ücretsizdir. Üye olarak kampanyalardan ve indirimlerden ilk 
                siz haberdar olursunuz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Şifremi unuttum, ne yapmalıyım?</AccordionTrigger>
              <AccordionContent>
                Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak şifrenizi sıfırlayabilirsiniz. 
                E-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Siparişimi iptal edebilir miyim?</AccordionTrigger>
              <AccordionContent>
                Siparişiniz kargoya verilmeden önce iptal edebilirsiniz. Kargoya verildikten sonra 
                iade prosedürünü uygulamanız gerekmektedir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>Fatura kesiliyor mu?</AccordionTrigger>
              <AccordionContent>
                Evet, tüm siparişlerimiz için e-fatura kesilmektedir. Faturanız e-posta adresinize 
                gönderilecektir ve hesabınızdan da görüntüleyebilirsiniz.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}