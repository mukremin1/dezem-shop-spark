import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Hakkımızda</h1>
            <p className="text-lg text-muted-foreground">
              DEZEMU olarak, müşterilerimize en kaliteli ürünleri ve en iyi alışveriş deneyimini sunmak için çalışıyoruz.
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Misyonumuz</h2>
              <p className="text-muted-foreground">
                Müşteri memnuniyetini her şeyin üstünde tutarak, güvenilir ve hızlı bir e-ticaret deneyimi sunmak. 
                Kaliteli ürünleri uygun fiyatlarla sizlere ulaştırmak ve her zaman yanınızda olmak.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Vizyonumuz</h2>
              <p className="text-muted-foreground">
                Türkiye'nin en güvenilir ve tercih edilen online alışveriş platformlarından biri olmak.
                Sürekli gelişen ürün yelpazemiz ve müşteri odaklı yaklaşımımızla sektörde öncü olmak.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Değerlerimiz</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Müşteri memnuniyeti önceliğimizdir</li>
                <li>Kaliteli ve orijinal ürünler sunuyoruz</li>
                <li>Hızlı ve güvenli kargo</li>
                <li>Kolay iade ve değişim</li>
                <li>7/24 müşteri desteği</li>
                <li>Şeffaf ve güvenilir hizmet</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">İletişim</h2>
              <p className="text-muted-foreground">
                Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz.
                Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
              </p>
              <div className="space-y-2 pt-4">
                <p className="text-muted-foreground">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:destek@dezemu.com" className="hover:text-primary">
                    destek@dezemu.com
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Telefon:</strong>{" "}
                  <a href="tel:+905395263293" className="hover:text-primary">
                    +90 539 526 32 93
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}