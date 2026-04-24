# Panduan Manajemen Blog Prima Roster untuk AI (AI Blog Guidelines)

Dokumen ini berisi panduan teknis dan struktural bagi AI (Artificial Intelligence) untuk membuat, mengedit, atau mengelola artikel blog pada website **Prima Roster**. 

Website Prima Roster adalah website profil perusahaan dan produsen roster beton minimalis berkualitas tinggi. Artikel blog bertujuan untuk mengedukasi pengunjung tentang arsitektur, desain rumah, ventilasi, dan penggunaan roster beton.

## 1. Lokasi File Artikel
Semua artikel blog disimpan sebagai file **JSON** statis di dalam direktori berikut:
`src/content/blog/`

## 2. Aturan Penamaan File (File Naming Convention)
File harus diberi nama menggunakan format tanggal dan slug judul artikel.
- **Format:** `YYYY-MM-DD-slug-judul-artikel.json`
- **Contoh:** `2026-05-10-keunggulan-roster-beton-untuk-pagar.json`
- **Aturan:** Gunakan huruf kecil semua (lowercase), jangan gunakan spasi (ganti dengan tanda hubung `-`), dan hindari karakter khusus.

## 3. Struktur JSON Artikel (Schema)
Setiap file JSON harus memiliki properti berikut secara persis:

```json
{
  "title": "Judul Lengkap Artikel (Maks. 60-70 karakter untuk SEO)",
  "date": "YYYY-MM-DD",
  "image": "/path/ke/gambar.png",
  "excerpt": "Ringkasan singkat artikel dalam 1-2 kalimat. Ini akan muncul di halaman daftar blog dan sangat penting untuk SEO.",
  "content": "<p>Paragraf pembuka artikel...</p><h3>Sub-judul Pertama</h3><p>Isi paragraf...</p>"
}
```

### Penjelasan Properti:
*   `title` (String): Judul artikel yang menarik dan mengandung *keyword* (contoh: roster beton, roster minimalis, loster, ventilasi rumah).
*   `date` (String): Tanggal publikasi dengan format `YYYY-MM-DD`.
*   `image` (String): Path menuju gambar unggulan (featured image).
    *   Jika gambar berada di folder `public/`, gunakan path absolut dari root, contoh: `/product_minimalist.png`, `/hero.png`, atau `/uploads/nama-gambar.jpg`.
*   `excerpt` (String): Kutipan atau ringkasan pendek. Jangan gunakan tag HTML di sini.
*   `content` (String): Isi artikel lengkap dalam bentuk **HTML murni**.

## 4. Panduan Menulis `content` (HTML Markup)
Karena situs ini menggunakan *vanilla renderer*, isi konten (`content`) harus ditulis dalam tag HTML satu baris (*single string*) tanpa *line break* (`\n`) yang merusak struktur JSON.

*   **Paragraf:** Gunakan `<p>...</p>` untuk setiap paragraf.
*   **Sub-judul:** Gunakan `<h3>...</h3>` untuk sub-topik. (Jangan gunakan `<h1>` atau `<h2>` karena sudah dipakai oleh struktur *layout* utama website).
*   **Daftar (List):** Gunakan `<ul><li>...</li></ul>` atau `<ol><li>...</li></ol>`.
*   **Penekanan:** Gunakan `<strong>...</strong>` untuk teks tebal (bold).

**Contoh Format `content` yang Benar:**
```json
"content": "<p>Roster beton bukan hanya sekadar lubang angin, tetapi juga elemen estetika.</p><h3>1. Sirkulasi Udara Maksimal</h3><p>Dengan menggunakan roster, udara dapat berganti secara alami.</p><ul><li>Hemat energi</li><li>Rumah lebih sejuk</li></ul>"
```

## 5. Gaya Bahasa & SEO (Tone of Voice)
*   **Gaya Bahasa:** Profesional, informatif, edukatif, namun tetap ramah dan mudah dipahami. Gunakan Bahasa Indonesia baku namun tidak kaku (seperti gaya penulisan majalah arsitektur atau desain interior).
*   **Sudut Pandang:** Gunakan kata ganti "kami" untuk merujuk pada Prima Roster, dan "Anda" untuk merujuk pada pembaca/pelanggan.
*   **Keyword (Kata Kunci):** Sisipkan kata kunci berikut secara natural di dalam `title`, `excerpt`, dan `content`:
    *   Roster beton
    *   Roster minimalis
    *   Fasad rumah modern
    *   Sirkulasi udara / ventilasi rumah
    *   Pagar roster
*   **Call to Action (CTA):** Artikel selalu diakhiri dengan ajakan halus untuk melihat katalog produk Prima Roster atau mengkonsultasikan kebutuhan mereka melalui WhatsApp. (Tombol "Kembali ke Blog" sudah otomatis ditambahkan oleh *renderer*, jadi AI tidak perlu membuat tombol *back*).

## 6. Integrasi dengan CMS (Decap CMS)
Website ini juga dikonfigurasi dengan Netlify/Decap CMS di `/admin/`. Perubahan pada file JSON melalui panduan ini akan secara otomatis terbaca oleh CMS, dan sebaliknya, artikel yang dibuat melalui CMS akan menghasilkan file JSON dengan format yang sama persis seperti yang dijelaskan di atas.

## 7. Instruksi untuk AI (Prompt Hook)
Jika *User* meminta AI untuk: *"Buatkan artikel blog tentang X"*, AI harus:
1. Membaca file ini (`AI_BLOG_GUIDELINES.md`) untuk mengingat struktur.
2. Membuat (generate) konten HTML untuk artikel.
3. Menyimpan hasilnya langsung sebagai file `.json` baru di direktori `src/content/blog/` menggunakan alat penulisan file (`write_to_file`).
