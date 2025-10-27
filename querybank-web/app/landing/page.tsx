'use client';

import { useRouter } from 'next/navigation';
import {
  Sparkles, Terminal, Shield, Zap,
  Users, Award, Brain,
  PieChart, Activity, ArrowRight, CheckCircle2,
  X, AlertCircle, Check, MessageSquare, BarChart
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const problemPoints = [
    {
      icon: X,
      title: 'SQL Bilməliyəm',
      description: 'Sadə sual üçün belə texniki komandadan asılıyam'
    },
    {
      icon: X,
      title: 'Saatlarla Gözləmək',
      description: 'Hər analiz üçün IT departamentindən növbə gözləyirəm'
    },
    {
      icon: X,
      title: 'Excel Çətinlikləri',
      description: 'Verilənləri əl ilə export edib, pivot table yaratmalıyam'
    },
    {
      icon: X,
      title: 'Real-time Yoxdur',
      description: 'Dünənki data ilə bu günkü qərar verməliyəm'
    },
  ];

  const solutionPoints = [
    {
      icon: MessageSquare,
      title: 'Sadə Dillə Danış',
      description: 'SQL öyrənməyə ehtiyac yoxdur',
      example: '"Ən yüksək balansa malik 10 müştəri göstər"'
    },
    {
      icon: Zap,
      title: 'Saniyələrdə Cavab Al',
      description: 'IT komandası gözləməyə ehtiyac yoxdur',
      example: '2-3 saniyədə tam analiz və qrafiklər'
    },
    {
      icon: BarChart,
      title: 'Avtomatik Vizuallaşdırma',
      description: 'Excel manipulyasiyasına ehtiyac yoxdur',
      example: 'Qrafiklər avtomatik yaranır və yüklənir'
    },
    {
      icon: Activity,
      title: 'Canlı Məlumat',
      description: 'Köhnə data ilə işləməyə ehtiyac yoxdur',
      example: 'Real-time bank database connection'
    },
  ];

  const useCases = [
    {
      role: 'Risk Manager',
      problem: 'Yüksək riskli müştəriləri tez müəyyənləşdirməliyəm, amma SQL bilmirəm',
      solution: 'Sadəcə soruşun: "Kredit reytinqi 650-dən aşağı və krediti 20K-dan çox olan müştərilər"',
      result: '2 saniyədə cavab + qrafik + risk səviyyəsi analizi',
      color: 'from-red-500 to-orange-500'
    },
    {
      role: 'Branch Manager',
      problem: 'Hər həftə filialın performansını analiz etməliyəm, texniki dəstək lazımdır',
      solution: 'İstənilən vaxt soruşun: "Bu ay ən çox əməliyyat edən müştərilər kimdir?"',
      result: 'Dərhal cavab, təkrar suallar üçün texniki komandaya müraciət etməyə ehtiyac yoxdur',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      role: 'Credit Officer',
      problem: 'Kredit portfelini izləyirəm, amma data hər dəfə Excel-də işləməli',
      solution: 'Təbii dildə: "Defolt dərəcəsi ən yüksək olan kredit növləri"',
      result: 'Avtomatik qrafik, Excel-ə export etməyə ehtiyac yoxdur',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  const beforeAfter = {
    before: [
      { time: '2-3 saat', task: 'IT komandası sorğu yazır' },
      { time: '30 dəqiqə', task: 'Excel-ə export və təmizləmə' },
      { time: '1 saat', task: 'Pivot table və qrafik yaratma' },
      { time: '30 dəqiqə', task: 'PowerPoint-ə əlavə etmə' },
    ],
    after: [
      { time: '5 saniyə', task: 'Sualı təbii dildə yazın' },
      { time: '2 saniyə', task: 'AI avtomatik SQL yaradır' },
      { time: '1 saniyə', task: 'Nəticə və qrafik hazırdır' },
      { time: '0 saniyə', task: 'Texniki biliyə ehtiyac yoxdur' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">QueryBank AI</h2>
                <p className="text-xs text-slate-600">SQL Bilməyə Ehtiyac Yoxdur</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="hidden sm:block px-5 py-2 text-slate-700 hover:text-slate-900 transition font-medium"
              >
                Daxil Ol
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg shadow-blue-500/30"
              >
                Pulsuz Sınayın
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Problem Statement Hero */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Problem Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-5 py-2.5">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-semibold text-red-700">PROBLEM</span>
            </div>
          </div>

          {/* Main Problem Statement */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight">
              SQL Bilmədən
              <br />
              <span className="text-red-600">Bank Məlumatlarını</span>
              <br />
              Necə Təhlil Edim?
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Siz bank menecerisiniz. Data analizi lazımdır, amma SQL bilmirsiniz.
              <br className="hidden sm:block" />
              Hər dəfə IT komandası gözləməli, Excel-lə əl ilə işləməlisiniz.
              <br className="hidden sm:block" />
              <span className="font-bold text-slate-900">Bu problem həll edildi.</span>
            </p>
          </div>

          {/* Problem Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {problemPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-red-200 rounded-2xl p-6 hover:border-red-300 transition-all"
              >
                <div className="bg-red-100 p-3 rounded-xl inline-block mb-4">
                  <point.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{point.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Hero */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          {/* Solution Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-300 rounded-full px-5 py-2.5">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">HƏLL</span>
            </div>
          </div>

          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight">
              Sadəcə
              <span className="text-green-600"> Sualınızı Yazın</span>
              <br />
              AI Qalanını Edir
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              QueryBank AI təbii Azərbaycan dilində suallarınızı başa düşür,
              <br />
              avtomatik SQL yaradır və saniyələrdə cavab gətirir.
              <br />
              <span className="font-bold text-green-600">SQL, Python və ya Excel bilməyə ehtiyac yoxdur.</span>
            </p>
          </div>

          {/* Solution Points Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {solutionPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-white border border-green-200 rounded-2xl p-8 hover:border-green-400 hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl flex-shrink-0">
                    <point.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{point.title}</h3>
                    <p className="text-slate-600 mb-3">{point.description}</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-medium">{point.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Credentials - Prominent */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-white" />
            <h3 className="text-2xl font-bold text-white">2 Dəqiqədə Sınayın - Pulsuz Demo</h3>
          </div>
          <p className="text-blue-100 mb-6">Qeydiyyat tələb olunmur. Dərhal başlayın.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
              <p className="text-blue-200 text-sm mb-2">Email</p>
              <p className="text-white font-mono font-bold text-lg">demo@querybank.az</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
              <p className="text-blue-200 text-sm mb-2">Password</p>
              <p className="text-white font-mono font-bold text-lg">demo123</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="group px-12 py-5 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all font-black text-xl shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
          >
            <span>İndi Sınayın</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Real Use Cases */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-blue-700 font-semibold">REAL SCENARIOS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Sizin Kimi Menecerlər Necə İstifadə Edir?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real vəziyyətlər. Real problemlər. Real həllər.
            </p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Role */}
                  <div className="lg:col-span-2">
                    <div className={`bg-gradient-to-br ${useCase.color} p-4 rounded-2xl inline-block`}>
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-4">{useCase.role}</h3>
                  </div>

                  {/* Problem */}
                  <div className="lg:col-span-3">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-red-700 mb-2">PROBLEM</p>
                      <p className="text-sm text-slate-700">{useCase.problem}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="lg:col-span-1 flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-300" />
                  </div>

                  {/* Solution */}
                  <div className="lg:col-span-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-2">HƏLL</p>
                      <p className="text-sm text-slate-700 italic">"{useCase.solution}"</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="lg:col-span-1 flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-300" />
                  </div>

                  {/* Result */}
                  <div className="lg:col-span-2">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-green-700 mb-2">NƏTİCƏ</p>
                      <p className="text-sm text-slate-700 font-medium">{useCase.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              4 Saat → 8 Saniyə
            </h2>
            <p className="text-xl text-slate-600">
              Tipik analiz prosesinin nə qədər dəyişdiyinə baxın
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-8">
              <div className="bg-red-100 p-3 rounded-xl inline-block mb-6">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">ƏVVƏL</h3>
              <p className="text-slate-600 mb-8">Ənənəvi yol (texniki asılılıq)</p>
              <div className="space-y-4">
                {beforeAfter.before.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="bg-red-100 text-red-600 rounded-lg px-3 py-1 text-sm font-bold whitespace-nowrap">
                      {step.time}
                    </div>
                    <p className="text-slate-700 flex-1">{step.task}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t-2 border-red-200">
                <p className="text-3xl font-black text-red-600">~4 SAAT</p>
                <p className="text-sm text-slate-600">+ Texniki komandadan asılılıq</p>
              </div>
            </div>

            {/* After */}
            <div className="bg-white border-2 border-green-300 rounded-3xl p-8 shadow-xl">
              <div className="bg-green-100 p-3 rounded-xl inline-block mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">İNDİ</h3>
              <p className="text-slate-600 mb-8">QueryBank AI ilə (tam müstəqil)</p>
              <div className="space-y-4">
                {beforeAfter.after.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="bg-green-100 text-green-600 rounded-lg px-3 py-1 text-sm font-bold whitespace-nowrap">
                      {step.time}
                    </div>
                    <p className="text-slate-700 flex-1">{step.task}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t-2 border-green-300">
                <p className="text-3xl font-black text-green-600">8 SANİYƏ</p>
                <p className="text-sm text-slate-600">Tam müstəqil, real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Nəyə Görə QueryBank AI?
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { icon: Brain, title: 'Azərbaycan dilində AI', desc: 'Təbii dildə suallar verin, AI SQL yaradır' },
              { icon: Zap, title: '91.5% daha sürətli', desc: 'Prompt optimizasiyası ilə saniyələrdə cavab' },
              { icon: Shield, title: 'Bank səviyyəsində təhlükəsizlik', desc: 'JWT, bcrypt, SQL injection qorunması' },
              { icon: Activity, title: 'Real-time məlumat', desc: 'Canlı PostgreSQL bağlantısı, köhnə data yoxdur' },
              { icon: PieChart, title: '15+ hazır analitika', desc: 'Risk, müştəri, kredit analizi bir paneldə' },
              { icon: Terminal, title: 'SQL konsolu power users üçün', desc: 'Təcrübəli istifadəçilər üçün birbaşa SQL interfeysi' },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            SQL Öyrənməyə Ehtiyac Yoxdur
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sadəcə sualınızı verin, AI qalanını edir.
            <br />
            Demo hesabla 2 dəqiqədə başlayın. Qeydiyyat tələb olunmur.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="group px-16 py-6 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all font-black text-2xl shadow-2xl hover:scale-105 inline-flex items-center space-x-4"
          >
            <span>İndi Başlayın</span>
            <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
          </button>
          <div className="mt-8 flex items-center justify-center space-x-6 text-white/90 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Kredit kartı tələb olunmur</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Dərhal çıxış</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Bütün funksiyalar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">QueryBank AI</span>
                <p className="text-xs text-slate-400">SQL Bilməyə Ehtiyac Yoxdur</p>
              </div>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 QueryBank AI. Bütün hüquqlar qorunur.
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">Powered by <span className="text-blue-400 font-semibold">Google Gemini 2.5</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
