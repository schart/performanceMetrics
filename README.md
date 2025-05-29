Tabii, işte istediğin şekilde temiz ve profesyonel bir **Proje Geliştirme Özeti** listesi ve önerilen ilk commit mesajı:

---

## Proje Geliştirme Özeti

- Person ve Computer tabloları kaldırıldı, cihazlar doğrudan yönetiliyor.
- Kod yapısı repo, service, controller ve mapper olarak ayrıldı; düzenli ve okunabilir hale getirildi.
- Start Date, End Date ve Device parametrelerine göre filtreleme yapılıyor:

  - Sadece start varsa, o tarihten sonraki kayıtlar listeleniyor.
  - Sadece end varsa, o tarihe kadar olan kayıtlar listeleniyor.

- Dakika aralıklarında kayıt kontrolü sağlanıyor:

  - Kayıt yoksa 20 adet yeni kayıt oluşturuluyor.
  - Kayıt varsa id’leri alınarak toplu işlemler yapılıyor.

- Cihaz dinleme aralıkları `.env` dosyasından okunuyor.
- Cihaza göre listeleme özelliği eklendi.
- Proje GitHub ile versiyonlanıyor.

---
