'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, BarChart3, Terminal, Shield, Zap, Database, ChevronRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Sorğular',
      description: 'Təbii dildə sual verin, AI SQL yaradır və nəticələri vizuallaşdırır',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analitika',
      description: 'Müştəri, kredit və risk analizi üzrə canlı hesabatlar',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: Terminal,
      title: 'SQL Konsolu',
      description: 'Təcrübəli istifadəçilər üçün birbaşa verilənlər bazası sorğuları',
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'Təhlükəsiz & Etibarlı',
      description: 'JWT autentifikasiya, bcrypt şifrələmə, read-only SQL',
      color: 'from-red-600 to-orange-600',
    },
  ];

  const stats = [
    { value: '15+', label: 'Analitik Sorğu' },
    { value: '<2s', label: 'Yükləmə Vaxtı' },
    { value: '100%', label: 'Mobil Uyğun' },
    { value: '24/7', label: 'Hazır' },
  ];

  const benefits = [
    'Azərbaycan dilində tam dəstək',
    'Google Gemini 2.5 Flash AI',
    'Real-time məlumat analizi',
    'Avtomatik qrafik yaratma',
    'Risk və performans metriklər',
    'Müştəri seqmentasiyası',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          {/* Header */}
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">QueryBank AI</h2>
                <p className="text-sm text-blue-200">Bank Analitika Platforması</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition font-medium"
            >
              Daxil Ol
            </button>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Bank Məlumatlarını
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI ilə Təhlil Edin
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Təbii dildə sual verin, saniyələr içində cavab alın. Müştəri, kredit və risk analizi üzrə
                professional hesabatlar.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-lg flex items-center space-x-2 shadow-2xl shadow-blue-500/50"
              >
                <span>Başlayın</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition font-semibold text-lg"
              >
                Demo Baxın
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <p className="text-sm text-blue-200 mb-2">Demo Hesab:</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                <div className="text-white">
                  <span className="text-blue-300">Email:</span> demo@querybank.az
                </div>
                <div className="text-white">
                  <span className="text-blue-300">Parol:</span> demo123
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Güclü Xüsusiyyətlər
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bank məlumatlarını təhlil etmək üçün lazım olan hər şey bir platformada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl inline-block mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Niyə QueryBank AI?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Bank məlumatları ilə işləmək heç vaxt bu qədər asan olmamışdı. AI texnologiyası ilə
                mürəkkəb analitikadan professional hesabatlara qədər hər şey bir klikdə.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Sürətli & Təsirli</h4>
                      <p className="text-sm text-slate-600">
                        2 saniyədən az yükləmə vaxtı. 91.5% performans artımı.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Database className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Real-Time Data</h4>
                      <p className="text-sm text-slate-600">
                        Canlı PostgreSQL məlumat bazası. Hardkod yoxdur, yalnız real data.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Təhlükəsiz</h4>
                      <p className="text-sm text-slate-600">
                        JWT tokens, bcrypt şifrələmə, SQL injection qorunması.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Hazırsınız?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            QueryBank AI ilə bank məlumatlarınızı saniyələr içində təhlil edin.
            Demo hesabla indi başlayın.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-bold text-lg shadow-2xl inline-flex items-center space-x-2"
          >
            <span>Pulsuz Başlayın</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-semibold">QueryBank AI</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 QueryBank AI. Bütün hüquqlar qorunur.
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>Powered by</span>
              <span className="text-blue-400 font-semibold">Google Gemini 2.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
