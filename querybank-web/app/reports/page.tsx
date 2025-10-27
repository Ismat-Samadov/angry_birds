'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, DollarSign, FileText, BarChart3, MessageSquare, LogOut } from 'lucide-react';
import DataChart from '@/components/DataChart';
import StatsCard from '@/components/StatsCard';

interface Stats {
  customers: number;
  loans: number;
  totalLoanBalance: number;
  totalDeposits: number;
}

interface ChartData {
  title: string;
  data: any[];
  chartType: 'bar' | 'line' | 'pie';
  config: any;
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [customResult, setCustomResult] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchStats();
    fetchPredefinedReports();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchPredefinedReports = async () => {
    setLoading(true);
    const queries = [
      { title: 'Kredit Növlərinə Görə Balans', question: 'Kredit növlərinə görə ümumi kredit balansını göstər' },
      { title: 'Hesab Növlərinə Görə Orta Kredit Reytinqi', question: 'Hesab növlərinə görə orta kredit reytinqi göstər' },
      { title: 'Ən Yüksək Balansa Malik Müştərilər', question: 'Ən yüksək balansa malik 5 müştərini göstər' },
    ];

    const chartResults: ChartData[] = [];

    for (const query of queries) {
      try {
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: query.question }),
        });

        const result = await response.json();

        if (result.success && result.data && result.queryInfo.needs_chart) {
          chartResults.push({
            title: query.title,
            data: result.data,
            chartType: result.queryInfo.chart_type,
            config: result.queryInfo.chart_config,
          });
        }
      } catch (error) {
        console.error(`Error fetching ${query.title}:`, error);
      }
    }

    setCharts(chartResults);
    setLoading(false);
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setLoading(true);
    setCustomResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: customQuery }),
      });

      const result = await response.json();

      if (result.error) {
        setCustomResult({ error: result.error });
      } else {
        setCustomResult(result);
      }
    } catch (error: any) {
      setCustomResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const demoQueries = [
    'Aktiv kredit statuslu müştərilərin sayı',
    'Orta müştəri balansı nədir?',
    'Ən böyük kredit məbləği',
    'Hesab növlərinə görə müştəri sayı',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Hesabatlar və Analitika
                  </h1>
                  <p className="text-sm text-slate-600">Ətraflı məlumat analizi</p>
                </div>
              </div>
              <nav className="flex space-x-2">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Çat</span>
                </button>
                <button
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium"
                >
                  <span>Hesabatlar</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-slate-700 font-medium">
                  {user.full_name}
                </span>
              )}
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıxış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Dashboard */}
        {stats && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Əsas Göstəricilər</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Aktiv Müştərilər"
                value={stats.customers.toLocaleString()}
                icon={Users}
                trend="+12.5%"
                trendUp={true}
                color="blue"
              />
              <StatsCard
                title="Aktiv Kreditlər"
                value={stats.loans.toLocaleString()}
                icon={FileText}
                trend="+8.2%"
                trendUp={true}
                color="green"
              />
              <StatsCard
                title="Ümumi Kredit Balansı"
                value={`${(stats.totalLoanBalance / 1000).toFixed(0)}K ₼`}
                icon={TrendingUp}
                trend="-2.3%"
                trendUp={false}
                color="purple"
              />
              <StatsCard
                title="Ümumi Depozitlər"
                value={`${(stats.totalDeposits / 1000).toFixed(0)}K ₼`}
                icon={DollarSign}
                trend="+15.7%"
                trendUp={true}
                color="indigo"
              />
            </div>
          </div>
        )}

        {/* Predefined Charts */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Avtomatik Hesabatlar</h2>
          {loading && charts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="flex space-x-2 justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-slate-600 mt-3">Hesabatlar yüklənir...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">{chart.title}</h3>
                  <div className="h-80">
                    <DataChart
                      data={chart.data}
                      chartType={chart.chartType}
                      config={chart.config}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Query Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Xüsusi Sorğu</h2>
          <p className="text-sm text-slate-600 mb-4">
            Verilənlər bazasından məlumat əldə etmək üçün təbii dildə sual yazın
          </p>

          {/* Demo Queries */}
          <div className="mb-4">
            <p className="text-xs text-slate-600 mb-2">Nümunə sorğular:</p>
            <div className="flex flex-wrap gap-2">
              {demoQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomQuery(query)}
                  className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-slate-700"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Query Form */}
          <form onSubmit={handleCustomQuery} className="mb-6">
            <div className="flex space-x-3">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Sorğunuzu daxil edin..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !customQuery.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {loading ? 'Yüklənir...' : 'Sorğula'}
              </button>
            </div>
          </form>

          {/* Custom Query Results */}
          {customResult && (
            <div className="border-t border-slate-200 pt-6">
              {customResult.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p className="font-semibold">Xəta:</p>
                  <p className="text-sm">{customResult.error}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-700 mb-4">{customResult.queryInfo?.explanation}</p>

                  {/* Data Table */}
                  {customResult.data && customResult.data.length > 0 && (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            {Object.keys(customResult.data[0]).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {customResult.data.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              {Object.values(row).map((value: any, i) => (
                                <td key={i} className="px-4 py-3 whitespace-nowrap text-slate-900">
                                  {typeof value === 'number' && value > 1000
                                    ? value.toLocaleString()
                                    : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Chart */}
                  {customResult.queryInfo?.needs_chart && customResult.data && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="h-80">
                        <DataChart
                          data={customResult.data}
                          chartType={customResult.queryInfo.chart_type}
                          config={customResult.queryInfo.chart_config}
                        />
                      </div>
                    </div>
                  )}

                  {/* SQL Query */}
                  {customResult.queryInfo?.query && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                        SQL Sorğusu
                      </summary>
                      <pre className="mt-2 text-xs bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto">
                        {customResult.queryInfo.query}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
