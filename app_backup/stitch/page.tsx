export const metadata = {
  title: "Study Buddy Landing",
  description: "Marketing landing page for Study Buddy",
};

const bgHero =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxO-Ig-X4uzHRDcSwbqSThaS7uiqTURYModBw0GXKDjqChnzC4eP9y5GfyHrPEhJbE5hZ8UIedFbuzZDDVMUY9wqAKJphtFEwS2QRyhgS5unjKltD0seUXoq1cs4wfVlZb5m5fbQ1XfkFPIEUsrkx0NyhnzA_GnOByAbR-QImIQHY_G0SS_93ZLpmTkwFKP3LeZiv-6USLeIUStWBzs97nf7fms7S7-QvIG3nd6SWliuzZgVCCTnJmVXePBN1WQbxAxpb9VwrhqX4r";

const bgStep1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKQYHFTkTBovV63IRupwNOqwkiaItil4tmx9gZ5orVQcaxXbbvw_QffQ08imhPj8XjEGLi8fyd7Bf1zzo-xT0mYMOZ8Vlbj_HgZgHSYtoe3lR6kvdqe1XL6gpgrcvdOeGiLDFwtwkM86a_fB_ARwIu6r_7V3kc-mWc5y7DoyMFyKVDtSVBkDyEMnKcDz6UgNSi_GwUgQkS6ISFK7Av2dXXhV47Y3-WKr9wnX4AsaJjuhVETQLEorR9X9zJksJDJiRcaqIZjb2G7srU";

const bgStep2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDx-YrDA3yUOSrhUHKZ-Y2YLtx5l5XYtPjsCH2Qpg-0DUn5rSg6JLWUR1j-8ImY_LYmzDruAc08njZWykfVamfwbIL7ny4luOxYdsquziDPwajKhFM1ueUWmkfIexQhuMppU8SLP1ctgSyOx8jqLI7_RUlfjekQu7F-0Pxrv5lvikPPihPwj1DY9eXOI-3l7vJRAlc2KUwbDRnDDqdLr5bxKFcFazxN27B5ZH1Lj4AuF6Zd77zGo1pCPHLkWO2LZ5EphCSBRExYq1dx";

const bgStep3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUigdDf2GejQpJkJByhjhb8T6VI4WuJmcWnyCsdHRi0fLIsfeQAU5TcPLeBsQg1nLjt0KLENbyhTDn4T_vR7--aOMDz92_UeNj9YXZ-b0M5e_pJCJD6ZvHwq5SziqeFPrq_bckjkHjdkqXJFagwIBEgtE4yeCsopni4wpMEuSNAbtefTYM3SmuBpz3NGeemzGEGLlqa5zIYRL9t7IdweohVbPdID_9h4JWZpnkP5xa53M6AsdDTxDcvycXk-6QNBbBXg17IihBzzU9";

export default function StitchLandingPage() {
  return (
    <div className="bg-[#f5f6f8] text-slate-900 min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-600">
                🚚
              </div>
              <span className="text-xl font-bold tracking-tight">Study Buddy</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a className="hover:text-blue-600" href="#how-it-works">How it Works</a>
              <a className="hover:text-blue-600" href="#benefits">Core Benefits</a>
              <a className="hover:text-blue-600" href="/login">Login</a>
              <a
                className="bg-blue-600 text-white py-2.5 px-6 rounded-full shadow hover:bg-blue-700"
                href="/signup"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#101622]/90 via-[#101622]/70 to-[#101622]" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgHero})` }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Study Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Freight Brokering with <span className="text-blue-400">AI Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Reduce cognitive load. Make studying possible. The intelligent companion for the modern logistics pro, designed to help you pass faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold h-12 px-8 rounded-full shadow hover:bg-blue-700"
              href="/signup"
            >
              Get Started Free ➜
            </a>
            <a
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-bold h-12 px-8 rounded-full hover:bg-white/20"
              href="#how-it-works"
            >
              ▶ See How It Works
            </a>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-10 max-w-4xl mx-auto">
            {[
              ["98%", "Pass Rate"],
              ["5k+", "Active Students"],
              ["24/7", "AI Tutor Access"],
              ["100+", "Modules"],
            ].map(([stat, label]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl font-bold">{stat}</span>
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section id="benefits" className="py-24 bg-[#f5f6f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Core Benefits</h2>
            <p className="text-slate-600 mt-4 max-w-2xl text-lg">
              Designed for the complexities of the freight and logistics industry. We simplify the chaos into structured learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["🎧", "Dispatch Mastery", "Master the art of dispatching with real-world scenarios. Handle drivers, negotiate rates, and manage timelines under pressure."],
              ["📈", "Freight Optimization", "Optimize brokering workflows using AI-driven insights. Understand market trends, lane analysis, and pricing strategies instantly."],
              ["🚚", "Fleet Management", "Learn efficient fleet management strategies, from maintenance scheduling to compliance and safety regulations."],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <span className="text-2xl">{icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 sticky top-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-slate-600 mb-8 max-w-md">
                A simple 3-step process to elevate your career from novice to logistics expert.
              </p>
              <a className="hidden md:inline-flex items-center gap-2 text-blue-600 font-bold" href="/signup">
                Start your assessment ➜
              </a>
            </div>
            <div className="flex-1 flex flex-col gap-12">
              {[
                ["1", "Initial Assessment", "Take a comprehensive initial assessment to identify your current knowledge gaps and strengths.", bgStep1],
                ["2", "AI Personalized Plan", "Our AI generates a custom study path tailored to your weak points and goals.", bgStep2],
                ["3", "Master the Road", "Apply your knowledge to real logistics challenges and track your progress.", bgStep3],
              ].map(([step, title, desc, img]) => (
                <div key={step} className="flex flex-col gap-4 group">
                  <div className="aspect-video w-full rounded-2xl bg-slate-800 overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        {step}
                      </span>
                      <span className="font-medium">{title}</span>
                    </div>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-slate-600 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to modernize your skills?</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals mastering the logistics industry today. Stop guessing, start learning with data-driven precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              className="bg-blue-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow hover:-translate-y-1 transition"
              href="/signup"
            >
              Get Started Now
            </a>
            <a className="text-slate-900 font-medium py-4 px-6 hover:text-blue-600" href="/billing">
              View Pricing Plans
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600">
                  🚚
                </div>
                <span className="text-lg font-bold">Study Buddy</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The intelligent study companion for freight brokering, dispatching, and trucking professionals.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-blue-600" href="#how-it-works">How it Works</a></li>
                <li><a className="hover:text-blue-600" href="/billing">Pricing</a></li>
                <li><a className="hover:text-blue-600" href="/lessons">For Enterprise</a></li>
                <li><a className="hover:text-blue-600" href="/progress">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-blue-600" href="/lessons">Blog</a></li>
                <li><a className="hover:text-blue-600" href="/lessons">Industry Reports</a></li>
                <li><a className="hover:text-blue-600" href="/lessons">Freight Glossary</a></li>
                <li><a className="hover:text-blue-600" href="/lessons">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-blue-600" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-blue-600" href="#">Terms of Service</a></li>
                <li><a className="hover:text-blue-600" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2023 Study Buddy Inc. All rights reserved.</p>
            <div className="flex gap-4 text-slate-400">
              <a className="hover:text-blue-600" href="#">Twitter</a>
              <a className="hover:text-blue-600" href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

