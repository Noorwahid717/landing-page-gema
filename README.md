# GEMA - Generasi Muda Informatika Landing Page
## SMA Wahidiyah Kediri - Pondok Pesantren Kedunglo

Landing page modern untuk komunitas GEMA (Generasi Muda Informatika) di SMA Wahidiyah Kediri yang dibangun dengan Next.js, TypeScript, dan Tailwind CSS.

## 🚀 Fitur

- **Hero Section** - Bagian utama dengan gradasi warna biru-hijau dan animasi menarik
- **Tentang GEMA** - Informasi komunitas dengan ilustrasi vector
- **Visi & Misi** - Grid 2 kolom dengan ikon yang representatif
- **Kegiatan Utama** - 4 card program unggulan:
  - 👨‍💻 Kelas Coding
  - 🛠️ Workshop Teknologi  
  - 🏆 Kompetisi IT
  - 💡 Proyek Kreatif
- **Manfaat Bergabung** - Keuntungan yang didapat peserta
- **Testimoni** - Feedback dari alumni
- **Call to Action** - Ajakan untuk bergabung
- **Footer** - Informasi kontak dan sosial media

## 🎨 Desain

- **Warna Utama**: Gradasi biru ke hijau neon
- **Typography**: Font modern dan readable
- **Animasi**: Smooth transitions menggunakan Framer Motion
- **Responsive**: Optimized untuk semua ukuran device
- **Icons**: Menggunakan Lucide React icons

## 🛠️ Teknologi

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library

## 📦 Instalasi

1. Clone repository:
```bash
git clone [repository-url]
cd landing-page-v2
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## 🏗️ Build Production

```bash
npm run build
npm start
```

## 🚀 Deploy ke Vercel

**Lihat panduan lengkap deployment di [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy

1. **One-Click Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/gema-landing-page)

2. **Manual Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
npm run deploy-preview

# Deploy production  
npm run deploy
```

3. **GitHub Integration (Recommended):**
   - Push ke GitHub repository
   - Connect repository di [vercel.com](https://vercel.com)
   - Auto-deploy setiap push ke main branch

## 📝 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production  
- `npm run start` - Menjalankan production server
- `npm run lint` - Cek ESLint issues

## 🔧 Kustomisasi

### Mengubah Konten

- **Hero Section**: Edit teks di `src/app/page.tsx` bagian Hero Section
- **Kegiatan**: Modify array `activities` untuk menambah/mengubah program
- **Kontak**: Update informasi kontak di bagian Footer
- **Testimoni**: Ganti testimoni di bagian Testimonial section

### Mengubah Styling

- **Warna**: Edit file `tailwind.config.ts` untuk custom colors
- **Font**: Update `src/app/layout.tsx` untuk menggunakan font berbeda
- **Spacing**: Adjust padding/margin di komponen sesuai kebutuhan

## 📱 Responsive Design

Landing page ini fully responsive dengan breakpoint:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎯 Target Audience

Landing page ini dirancang untuk:
- Siswa SMP yang tertarik melanjutkan ke SMA dengan program teknologi
- Calon santri yang ingin menggabungkan pendidikan agama dan teknologi
- Orang tua yang mencari sekolah berbasis pesantren dengan program informatika unggulan
- Masyarakat Kediri dan sekitarnya yang ingin tahu tentang program GEMA

## 🏫 Tentang SMA Wahidiyah Kediri

**SMA Wahidiyah** adalah sekolah menengah atas yang berada di lingkungan **Pondok Pesantren Kedunglo**, Kediri, Jawa Timur. Sekolah ini menggabungkan pendidikan formal dengan nilai-nilai pesantren, termasuk program unggulan **GEMA (Generasi Muda Informatika)** untuk mengembangkan kemampuan teknologi siswa.

### 📍 Informasi Sekolah:
- **Alamat**: Jl. KH. Wahid Hasyim, Ponpes Kedunglo, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur
- **Pendaftaran**: SPMB Kedunglo - [spmbkedunglo.com](https://spmbkedunglo.com)
- **Instagram**: [@smawahidiyah_official](https://instagram.com/smawahidiyah_official)
- **Email**: smaswahidiyah@gmail.com
- **Linktree**: [linktr.ee/smawahidiyah](https://linktr.ee/smawahidiyah)

## 📞 Kontak

Untuk informasi lebih lanjut tentang GEMA dan pendaftaran SMA Wahidiyah:
- **Email**: smaswahidiyah@gmail.com
- **Pendaftaran**: [SPMB Kedunglo](https://spmbkedunglo.com)
- **Instagram**: [@smawahidiyah_official](https://instagram.com/smawahidiyah_official)
- **Alamat**: Jl. KH. Wahid Hasyim, Ponpes Kedunglo, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur

## 📄 License

© 2024 GEMA - Generasi Muda Informatika | SMA Wahidiyah Kediri. All rights reserved.
