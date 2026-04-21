# Sudoku Generator 🧩

Bu projede Türk Beyin Takımı’nın eski bir üyesi olarak Sudoku ve Akıl Oyunları Turnuvalarında edindiğim tecrübeleri yazılım uygulamalarında kullanmayı amaçladım. Kendi Sudoku bulmacalarımı (Klasik ve Ardışık) oluşturmak, kuralları gerçek zamanlı olarak test etmek ve sonuçları PDF formatında dışa aktarmak amacıyla geliştirdiğim lokal bir web uygulamasıdır.

## 🚀 Özellikler

* **İki Farklı Oyun Türü:** Klasik Sudoku ve Ardışık (Consecutive) Sudoku desteği.
* **Farklı Boyut Seçenekleri:** 6x6 ve 9x9 grid yapılarında çalışabilme.
* **Gerçek Zamanlı Doğrulama (Real-Time Validation):** Grid üzerinde rakam girerken anlık kural kontrolü; çakışma durumlarında veya ardışıklık kuralı ihlallerinde hücrelerin anında kırmızıya boyanması.
* **Akıllı Çözücü Motoru:** Arka planda çalışan Backtracking algoritması ile oluşturulan bulmacanın çözülebilirliğini ve alternatif çözüm sayılarını hesaplama.
* **Profesyonel PDF Çıktısı:** Hazırlanan soruları ve çözümlerini, özel tasarım gridler, kalın bölge çizgileri ve ardışık çubukları (bars/circles) korunarak milimetrik hassasiyetle PDF'e aktarma.

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

Bu proje hızlı ve modern bir lokal web uygulaması (Local Web App) olarak tasarlanmıştır.

* **Backend:** FastAPI, Python
* **Çözücü ve Mantık (Logic):** Python, NumPy
* **PDF Görselleştirme:** ReportLab
* **Frontend:** HTML, CSS, JavaScript (Vanilla / React)
* **Veritabanı:** Yok (Stateless Architecture)

## 📦 Kurulum ve Çalıştırma

Projeyi kendi lokal ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

**1. Repoyu Klonlayın:**
```bash
git clone [https://github.com/erencankur/sudoku-generator.git](https://github.com/erencankur/sudoku-generator.git)
cd sudoku-generator
```

**2. Sanal Ortam (Virtual Environment) Oluşturun ve Aktif Edin:**
# Windows için
python -m venv venv
venv\Scripts\activate

# macOS / Linux için
python3 -m venv venv
source venv/bin/activate

**3. Gerekli Kütüphaneleri Yükleyin:**
pip install -r requirements.txt


**4. FastAPI Sunucusunu Başlatın:**
uvicorn main:app --reload

Sunucu başladıktan sonra tarayıcınızda http://localhost:8000 adresine giderek uygulamayı kullanmaya başlayabilirsiniz.


## 🎮 Nasıl Kullanılır?

* Arayüz üzerinden Klasik veya Ardışık sudoku türünü seçin.
* Grid boyutunu (6x6 veya 9x9) belirleyin.
* Rakamları hücrelere girin. Ardışık kuralını belirlemek için hücre sınırlarına tıklayarak işaretlerinizi (çubuk/daire) ekleyin.
* Sistemin anlık olarak verdiği görsel uyarıları (kırmızı hücreler) dikkate alın.
* "Çözmeyi Dene" butonuna basarak bulmacanın geçerliliğini test edin.
* Onayladıktan sonra bulmacanızı isim ve tarih bilgisiyle birlikte PDF olarak indirin.
* Bu proje kişisel kullanım ve algoritma geliştirme pratikleri amacıyla oluşturulmuştur.