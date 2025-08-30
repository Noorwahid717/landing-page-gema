"use client";

import { motion } from "framer-motion";
import { 
  Code, 
  Rocket, 
  Target, 
  Users, 
  Trophy, 
  Lightbulb, 
  BookOpen,
  Wrench,
  Instagram,
  Mail,
  MapPin
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-green-400 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
              <Code className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-white">GEMA</h2>
          </motion.div>

          {/* Main Content */}
          <div className="text-center text-white max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Generasi Muda <br />
              <span className="text-green-300">Informatika</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 opacity-90"
            >
              Wadah kreatif untuk belajar, berinovasi, dan berkembang di dunia teknologi.
              <br />
              <span className="text-lg">SMA Wahidiyah Kediri - Pondok Pesantren Kedunglo</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://spmbkedunglo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-400 hover:bg-green-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 inline-block text-center"
              >
                Daftar Sekarang
              </a>
              <a
                href="#tentang"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 inline-block text-center"
              >
                Pelajari Lebih Lanjut
              </a>
            </motion.div>
          </div>
          
          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center">
                    <Code className="w-8 h-8 text-black" />
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-16 h-16 bg-blue-300 rounded-lg flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-black" />
                  </div>
                  <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-black" />
                  </div>
                  <div className="w-16 h-16 bg-purple-400 rounded-lg flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-black" />
                  </div>
                  <div className="w-16 h-16 bg-pink-400 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-black" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Tentang GEMA</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Komunitas pelajar yang aktif dan kreatif di bidang teknologi di SMA Wahidiyah Kediri. 
              Kami menyediakan platform pembelajaran yang menyenangkan dan kolaboratif untuk generasi muda 
              yang ingin mengembangkan kemampuan di dunia informatika dengan nilai-nilai pesantren.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Visi</h3>
              <p className="text-lg text-gray-600">
                Menjadi komunitas teknologi terdepan yang melahirkan generasi muda 
                Indonesia yang inovatif dan kompeten di bidang informatika dengan 
                landasan akhlak mulia dan nilai-nilai pesantren.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Misi</h3>
              <ul className="text-left space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Memberikan pendidikan teknologi yang berkualitas
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Mengembangkan kreativitas dan inovasi siswa
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Membangun jaringan komunitas teknologi yang solid
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kegiatan Utama</h2>
            <p className="text-xl text-gray-600">Program unggulan yang kami tawarkan</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Code,
                title: "Kelas Coding",
                description: "Belajar pemrograman dari dasar hingga advance dengan mentor berpengalaman",
                color: "bg-blue-500"
              },
              {
                icon: Wrench,
                title: "Workshop Teknologi", 
                description: "Workshop praktis tentang teknologi terbaru dan trending di industri",
                color: "bg-green-500"
              },
              {
                icon: Trophy,
                title: "Kompetisi IT",
                description: "Ajang kompetisi untuk mengasah kemampuan dan bersaing dengan peserta lain",
                color: "bg-yellow-500"
              },
              {
                icon: Lightbulb,
                title: "Proyek Kreatif",
                description: "Mengembangkan ide kreatif menjadi solusi teknologi yang bermanfaat",
                color: "bg-purple-500"
              }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${activity.color} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <activity.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Manfaat Bergabung</h2>
            <p className="text-xl text-gray-600">Keuntungan yang akan kamu dapatkan</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: "🎉",
                title: "Belajar seru & menyenangkan",
                description: "Metode pembelajaran yang interaktif dan tidak membosankan"
              },
              {
                icon: "🧑‍🏫",
                title: "Dibimbing mentor berpengalaman", 
                description: "Mentor yang sudah berpengalaman di industri teknologi"
              },
              {
                icon: "🏅",
                title: "Ikut lomba & event IT",
                description: "Kesempatan berpartisipasi dalam berbagai kompetisi teknologi"
              },
              {
                icon: "📂",
                title: "Bangun portofolio digital",
                description: "Membuat portfolio yang menarik untuk masa depan karirmu"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Testimoni</h2>
            <p className="text-xl text-gray-600">Apa kata mereka tentang GEMA</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <blockquote className="text-xl text-gray-600 italic mb-6">
                &ldquo;Ikut GEMA bikin aku jago coding dan ketemu banyak teman baru! 
                Mentornya asik dan materinya mudah dipahami. Sekarang aku udah bisa 
                bikin aplikasi sendiri!&rdquo;
              </blockquote>
              <div className="font-bold text-gray-800">Ahmad Rizki</div>
              <div className="text-gray-500">Alumni GEMA 2023</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ayo jadi bagian dari Generasi Muda Informatika
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              dan mulai petualanganmu di dunia teknologi!
            </p>
            <a
              href="https://spmbkedunglo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-400 hover:bg-green-500 text-black font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Daftar Sekarang
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">GEMA</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Generasi Muda Informatika - Wadah kreatif untuk belajar dan berkembang di dunia teknologi 
                dengan landasan nilai-nilai pesantren di SMA Wahidiyah Kediri.
              </p>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">Ikuti Kami</h4>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://instagram.com/smawahidiyah_official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram SMA Wahidiyah"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://linktr.ee/smawahidiyah" 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Linktree SMA Wahidiyah"
                  className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Users className="w-5 h-5" />
                </a>
                <a 
                  href="https://spmbkedunglo.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="SPMB Kedunglo - Pendaftaran"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center justify-center md:justify-end">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>smaswahidiyah@gmail.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>spmbkedunglo.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Jl. KH. Wahid Hasyim, Kediri</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GEMA - Generasi Muda Informatika | SMA Wahidiyah Kediri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
