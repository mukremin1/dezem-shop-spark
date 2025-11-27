import React from "react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <main className="max-w-4xl mx-auto p-6 prose prose-sm md:prose-lg">
      <h1>Kullanım Şartları</h1>

      <p>
        Hoş geldiniz! Bu sayfa Dezemu platformunun kullanım şartlarını içerir. Lütfen siteyi kullanmadan önce bu şartları dikkatle okuyunuz.
        Bu koşullar, Dezemu tarafından sağlanan hizmetlerin kullanımına ilişkin tarafların hak ve yükümlülüklerini düzenler.
      </p>

      <h2>1. Tanımlar</h2>
      <ul>
        <li><strong>Site / Platform:</strong> Dezemu olarak belirtilen web uygulaması.</li>
        <li><strong>Kullanıcı / Müşteri:</strong> Siteye erişen veya satın alma yapan gerçek kişiler veya tüzel kişiler.</li>
        <li><strong>Satıcı / Ürün Sağlayıcı:</strong> Site üzerinde ürün ve hizmet sunan tedarikçi/iş ortağı (Dezemu tek satıcı modunda ise Dezemu kendisi olur).</li>
        <li><strong>Hizmetler:</strong> Site üzerinden sunulan tüm içerik, ürün listeleme, sipariş yönetimi ve iletişim araçları.</li>
      </ul>

      <h2>2. Şartların Kabulü</h2>
      <p>
        Siteyi kullanarak bu Kullanım Şartları’nı kabul etmiş sayılırsınız. Eğer bu şartları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
      </p>

      <h2>3. Hesap Oluşturma ve Güvenlik</h2>
      <p>
        Site üzerinde işlem yapmak için bir hesap oluşturmanız gerekebilir. Hesap bilgilerinizin doğruluğundan ve gizliliğinden siz sorumlusunuz.
        Şifre ve hesap güvenliği ile ilgili ihlallerden doğan sorumluluk kullanıcıya aittir. Şüpheli aktiviteler fark ederseniz derhal bize bildirin.
      </p>

      <h2>4. Sipariş ve Sözleşme</h2>
      <p>
        Bir ürün siparişi verdiğinizde, siparişiniz firmamız tarafından onaylandığında bir satış sözleşmesi kurulmuş olur. Sipariş onayı; stok, fiyat doğrulaması ve ödeme işlemleri sonrasında gönderilir.
      </p>

      <h2>5. Fiyatlar ve Ödeme</h2>
      <p>
        Site üzerindeki fiyatlar güncellenebilir ve yazım hatalarından kaynaklı hatalar düzeltilebilir. Sepet ve ödeme sırasında görülen fiyatlar o an için geçerlidir.
        Ödeme işlemleri güvenli ödeme sağlayıcıları aracılığıyla gerçekleştirilir. Ödeme bilgileri doğrudan ödeme sağlayıcıya iletilir; Dezemu kredi kartı bilgilerini saklamaz (veya saklama politikası varsa ayrıca açıklar).
      </p>

      <h2>6. Kargo, Teslimat ve İade</h2>
      <p>
        Teslimat süresi ve kargo koşulları ürün sayfasında belirtilir. Siparişin kargoya verilmesi ve teslimat süresi kargo firması tarafından gerçekleştirilir.
        İade ve değişim koşulları [İade Politikası] sayfasında açıklanmıştır. Tüketici haklarına ilişkin kanuni süreler geçerlidir.
      </p>

      <h2>7. Garantiler ve Sorumlulukların Sınırlandırılması</h2>
      <p>
        Ürün açıklamaları mümkün olduğunca doğru tutulmaya çalışılır ancak tedarikçi kaynaklı farklılıklar olabilir. Dezemu, üçüncü taraf tedarikçilerin ürünleriyle ilgili doğrudan garanti vermez; üretici garantisi veya satıcı garantisi varsa ürün sayfasında belirtilir.
        Hiçbir koşulda Dezemu'nun doğrudan veya dolaylı zararlar, kar kaybı, veri kaybı veya iş kesintisi nedeniyle sorumluluğu, yürürlükteki mevzuatın izin verdiği azami ölçüyle sınırlandırılmıştır.
      </p>

      <h2>8. Fikri Mülkiyet</h2>
      <p>
        Site içeriği (metinler, görseller, logolar, kod vb.) Dezemu veya lisans verenlerin mülkiyetindedir. İçeriğin izinsiz kullanımı, çoğaltılması veya dağıtılması yasaktır.
      </p>

      <h2>9. Kullanıcı İçeriği ve Davranış Kuralları</h2>
      <p>
        Kullanıcı tarafından paylaşılan yorum, değerlendirme ve içeriklerin doğruluğu kullanıcının sorumluluğundadır. Hakaret, yasa dışı faaliyetleri teşvik eden, telif hakkı ihlali veya kişisel verilerin kötüye kullanımı gibi içerikler yayınlanamaz.
        Dezemu bu tür içerikleri kaldırma ve gerektiğinde ilgili hesapları kısıtlama hakkına sahiptir.
      </p>

      <h2>10. Kayıtlı Veriler ve Gizlilik</h2>
      <p>
        Kişisel verilerin işlenmesi Gizlilik Politikası çerçevesinde yapılır. Gizlilik Politikası'nı okumak için <Link to="/privacy-policy">Gizlilik Politikası</Link> sayfasını ziyaret ediniz.
      </p>

      <h2>11. Yürürlük, Değişiklikler ve Fesih</h2>
      <p>
        Dezemu bu kullanım şartlarını zaman zaman güncelleyebilir. Önemli değişiklikler site üzerinden duyurulur veya kayıtlı e-posta adresinize bildirim gönderilir. Güncellenen şartlar yayınlandığı tarihte yürürlüğe girer.
        Dezemu, kullanım şartlarının ihlali halinde hesapları askıya alma, siparişleri iptal etme veya hizmetleri sonlandırma hakkına sahiptir.
      </p>

      <h2>12. Uyuşmazlıklar ve Uygulanacak Hukuk</h2>
      <p>
        Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Taraflar arasında doğabilecek uyuşmazlıklarda öncelikle müzakere yolu tercih edilir; çözüme ulaşılamaması halinde yetkili mahkeme ilgili mevzuata göre belirlenecektir.
      </p>

      <h2>13. İrtibat Bilgileri</h2>
      <p>
        Sorularınız, şikayet ve talepleriniz için:
      </p>
      <ul>
        <li>Adres: Palandöken / Erzurum</li>
        <li>Telefon: <a href="tel:+905395263293">0539 526 3293</a></li>
        <li>E-posta: <a href="mailto:destek@dezemu.com">destek@dezemu.com</a></li>
      </ul>

      <hr />

      <p className="text-sm text-gray-600">
        © {year} Dezemu. Bu metin bilgilendirme amaçlıdır ve hukuki danışmanlık yerine geçmez. Hassas hukuki konular için avukatınıza danışmanızı öneririz.
      </p>
    </main>
  );
};

export default Terms;
