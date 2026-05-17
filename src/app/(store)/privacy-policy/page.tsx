'use client'

// ទំព័រគោលការណ៍ឯកជនភាព - ភាសាពីរ
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function PrivacyPolicyPage() {
  const { locale } = useTranslation()

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">
            {locale === 'km' ? 'គោលការណ៍ឯកជនភាព' : 'Privacy Policy'}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-gaming p-8 space-y-8"
        >
          {/* ផ្នែកខ្មែរ */}
          <section>
            <h2 className="text-xl font-bold text-neon mb-4 font-khmer">គោលការណ៍ឯកជនភាព</h2>
            <div className="space-y-4 text-white/50 text-sm font-khmer leading-relaxed">
              <p><strong className="text-white/70">១. ការប្រមូលព័ត៌មាន:</strong> យើងប្រមូលព័ត៌មានដែលអ្នកផ្តល់ឱ្យដោយផ្ទាល់ រួមទាំងឈ្មោះ អ៊ីមែល និងព័ត៌មានបង់ប្រាក់។ ព័ត៌មានទាំងនេះត្រូវបានប្រើដើម្បីដំណើរការការបញ្ជាទិញរបស់អ្នក។</p>
              <p><strong className="text-white/70">២. ការប្រើប្រាស់ព័ត៌មាន:</strong> ព័ត៌មានរបស់អ្នកត្រូវបានប្រើដើម្បី: ដំណើរការការបញ្ជាទិញ, ផ្តល់សេវាកម្មអតិថិជន, ផ្ញើការអាប់ដេត និង កែលម្អសេវាកម្មរបស់យើង។</p>
              <p><strong className="text-white/70">៣. ការការពារព័ត៌មាន:</strong> យើងប្រើវិធានការសុវត្ថិភាពដើម្បីការពារព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកពីការចូលដំណើរការដោយគ្មានការអនុញ្ញាត។</p>
              <p><strong className="text-white/70">៤. ការចែករំលែកព័ត៌មាន:</strong> យើងមិនលក់ ផ្ទេរ ឬជួល ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកទៅភាគីទីបីឡើយ លើកលែងតែការផ្តល់សេវាកម្មតាមការបញ្ជាទិញ។</p>
              <p><strong className="text-white/70">៥. Cookies:</strong> គេហទំព័ររបស់យើងប្រើ cookies ដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។ អ្នកអាចបិទ cookies នៅក្នុង browser របស់អ្នក។</p>
              <p><strong className="text-white/70">៦. សិទ្ធិរបស់អ្នក:</strong> អ្នកមានសិទ្ធិស្នើសុំមើល កែប្រែ ឬលុបព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកនៅពេលណាក៏បាន។</p>
              <p><strong className="text-white/70">៧. គោលការណ៍សងប្រាក់វិញ:</strong> ផលិតផលឌីជីថលទាំងអស់មិនអាចសងប្រាក់វិញបានទេ បើអ្នកប្ដូរចិត្ត។ សូមពិចារណាឱ្យបានច្បាស់មុនពេលទិញ។ ករណីពិសេសទាក់ទងទៅ Admin តាម Telegram: @AF4STURF។</p>
            </div>
          </section>

          <hr className="border-neon/10" />

          {/* ផ្នែកអង់គ្លេស */}
          <section>
            <h2 className="text-xl font-bold text-neon mb-4">Privacy Policy (English)</h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed">
              <p><strong className="text-white/70">1. Information Collection:</strong> We collect information you provide directly, including your name, email, and payment information. This information is used to process your orders.</p>
              <p><strong className="text-white/70">2. Use of Information:</strong> Your information is used to: process orders, provide customer service, send updates, and improve our services.</p>
              <p><strong className="text-white/70">3. Information Protection:</strong> We use security measures to protect your personal information from unauthorized access.</p>
              <p><strong className="text-white/70">4. Information Sharing:</strong> We do not sell, transfer, or rent your personal information to third parties, except for providing services as ordered.</p>
              <p><strong className="text-white/70">5. Cookies:</strong> Our website uses cookies to improve your experience. You can disable cookies in your browser settings.</p>
              <p><strong className="text-white/70">6. Your Rights:</strong> You have the right to request to view, modify, or delete your personal information at any time.</p>
              <p><strong className="text-white/70">7. Refund Policy:</strong> All digital products are non-refundable if you change your mind. Please consider carefully before purchasing. For special cases, contact Admin on Telegram: @AF4STURF.</p>
            </div>
          </section>

          <div className="text-center pt-4">
            <p className="text-white/20 text-xs">
              {locale === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: ២០២៦' : 'Last updated: 2026'} - Makara Store
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
