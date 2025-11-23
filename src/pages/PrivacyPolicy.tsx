
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Gizlilik Politikası</h1>
      <p>Son güncelleme: 2025-11-23</p>

      <section>
        <h2>1. Giriş</h2>
        <p>
          Bu gizlilik politikası, <strong>Şirket / Site Adı</strong> ("biz", "sitemiz") tarafından toplanan kişisel
          verilerin nasıl işlendiğini açıklar. Sitemizi kullanarak bu politikada belirtilen uygulamaları kabul etmiş olursunuz.
        </p>
      </section>

      <section>
        <h2>2. Topladığımız veriler</h2>
        <ul>
          <li>Hizmet kullanımıyla ilgili bilgiler (oturum, tercih ayarları, sayfa gezinme verileri)</li>
          <li>Hesap oluşturma durumunda sağlanan veriler (e‑posta, kullanıcı adı vb.)</li>
          <li>Teknik veriler (IP adresi, tarayıcı türü, cihaz bilgileri)</li>
        </ul>
      </section>

      <section>
        <h2>3. Verileri toplama ve kullanma amacı</h2>
        <p>Veriler aşağıdaki amaçlarla kullanılır:</p>
        <ul>
          <li>Hizmet sunmak, hesap yönetimi ve müşteri desteği.</li>
          <li>Hizmet kalitesini iyileştirmek ve hata ayıklama.</li>
          <li>Pazarlama ve bilgilendirme (izin verdiğiniz takdirde).</li>
        </ul>
      </section>

      <section>
        <h2>4. Çerezler (Cookies)</h2>
        <p>
          Sitemiz çerezler veya benzeri teknolojiler kullanabilir. Çerezler, kullanıcı tercihlerini hatırlamak ve
          analiz amaçlıdır. Tarayıcı ayarlarından çerezleri devre dışı bırakabilirsiniz; ancak bu bazı özelliklerin
          çalışmamasına neden olabilir.
        </p>
      </section>

      <section>
        <h2>5. Üçüncü taraf hizmet sağlayıcılar</h2>
        <p>
          Hizmetlerimizi sağlamak için bazı üçüncü taraf sağlayıcıları (ör. Supabase, analytics araçları, ödeme sağlayıcıları)
          kullanıyoruz. Bu sağlayıcılar kendi gizlilik politikalarına tabidir. Bizimle paylaşılmış veriler ilgili servislerin
          politikalarına göre işlenir.
        </p>
      </section>

      <section>
        <h2>6. Veri güvenliği</h2>
        <p>
          Kişisel verilerinizi korumak için uygun teknik ve idari önlemler uygulamaya çalışıyoruz. Ancak internet üzerinden
          aktarılan verilerin yüzde yüz güvenliğini garanti etmek mümkün değildir.
        </p>
      </section>

      <section>
        <h2>7. Veri saklama süresi</h2>
        <p>
          Verileri yalnızca işleme amaçlarımızın gerektirdiği süre boyunca saklarız veya yasal gereklilikler nedeniyle saklamaya
          devam ederiz.
        </p>
      </section>

      <section>
        <h2>8. Haklarınız</h2>
        <p>
          KVKK / GDPR gibi yerel mevzuata bağlı olarak verilerinize erişim, düzeltme, silme gibi haklarınız olabilir. Bu hakları
          kullanmak için lütfen aşağıdaki iletişim bilgilerini kullanın.
        </p>
      </section>

      <section>
        <h2>9. İletişim</h2>
        <p>
          Gizlilikle ilgili sorularınız için: <strong>email@ornek.com</strong>
        </p>
      </section>

      <p>
        Ana sayfaya dönmek için <Link to="/">tıklayın</Link>.
      </p>
    </main>
  );
};

export default PrivacyPolicy;
