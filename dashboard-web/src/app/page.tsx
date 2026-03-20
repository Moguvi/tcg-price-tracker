'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { supabase, isConfigured, type PrecoRecord } from '@/lib/supabase';
import { TrendingUp, Filter, Database, ChevronDown } from 'lucide-react';

type Filters = {
  carta: string;
  edicao: string;
  ano: string;
  raridade: string;
  tipo_carta: string;
};

type ChartPoint = {
  data: string;
  preco_min: number | null;
  preco_medio: number | null;
};

const EMPTY_FILTERS: Filters = { carta: '', edicao: '', ano: '', raridade: '', tipo_carta: '' };

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a2235', border: '1px solid #1f2d45',
        borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 24px #0006'
      }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{label}</p>
        {payload.map((item: any) => (
          <div key={item.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
            <span style={{ color: '#e2e8f0', fontSize: 13 }}>
              {item.name}: <strong style={{ color: item.color }}>R$ {Number(item.value).toFixed(2)}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Filter Select Component
const FilterSelect = ({
  label, value, options, onChange, disabled
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <option value="">Todos</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Options for each filter (dynamic)
  const [cartas, setCartas] = useState<string[]>([]);
  const [edicoes, setEdicoes] = useState<string[]>([]);
  const [anos, setAnos] = useState<string[]>([]);
  const [raridades, setRaridades] = useState<string[]>([]);
  const [tiposCarta, setTiposCarta] = useState<string[]>([]);

  // Load all distinct carta names on mount
  useEffect(() => {
    supabase
      .from('his_precos_liga')
      .select('carta')
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r: any) => r.carta).filter(Boolean))].sort() as string[];
          setCartas(unique);
        }
      });
  }, []);

  // When carta changes, load related filters
  useEffect(() => {
    if (!filters.carta) {
      setEdicoes([]); setAnos([]); setRaridades([]); setTiposCarta([]);
      setFilters(f => ({ ...f, edicao: '', ano: '', raridade: '', tipo_carta: '' }));
      return;
    }
    let q = supabase.from('his_precos_liga').select('edicao,ano,raridade,tipo_carta').eq('carta', filters.carta);
    q.then(({ data }) => {
      if (!data) return;
      setEdicoes([...new Set(data.map((r: any) => r.edicao).filter(Boolean))].sort() as string[]);
      setAnos([...new Set(data.map((r: any) => String(r.ano)).filter(Boolean))].sort() as string[]);
      setRaridades([...new Set(data.map((r: any) => r.raridade).filter(Boolean))].sort() as string[]);
      setTiposCarta([...new Set(data.map((r: any) => r.tipo_carta).filter(Boolean))].sort() as string[]);
    });
  }, [filters.carta]);

  // Fetch chart data whenever any filter changes
  const fetchData = useCallback(async () => {
    if (!filters.carta) {
      setChartData([]);
      setTotalRecords(0);
      return;
    }
    setLoading(true);
    let q = supabase
      .from('his_precos_liga')
      .select('data,preco_min,preco_medio')
      .eq('carta', filters.carta)
      .order('data', { ascending: true });

    if (filters.edicao) q = q.eq('edicao', filters.edicao);
    if (filters.ano) q = q.eq('ano', Number(filters.ano));
    if (filters.raridade) q = q.eq('raridade', filters.raridade);
    if (filters.tipo_carta) q = q.eq('tipo_carta', filters.tipo_carta);

    const { data, error } = await q;
    setLoading(false);

    if (error || !data) return;

    // Group by date and average prices if multiple editions selected
    const grouped: Record<string, { min: number[], med: number[] }> = {};
    for (const row of data as any[]) {
      if (!grouped[row.data]) grouped[row.data] = { min: [], med: [] };
      if (row.preco_min != null) grouped[row.data].min.push(Number(row.preco_min));
      if (row.preco_medio != null) grouped[row.data].med.push(Number(row.preco_medio));
    }

    const points: ChartPoint[] = Object.entries(grouped).map(([date, vals]) => ({
      data: date,
      preco_min: vals.min.length ? parseFloat((vals.min.reduce((a, b) => a + b) / vals.min.length).toFixed(2)) : null,
      preco_medio: vals.med.length ? parseFloat((vals.med.reduce((a, b) => a + b) / vals.med.length).toFixed(2)) : null,
    }));

    setChartData(points);
    setTotalRecords(data.length);
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hasData = chartData.length > 0;
  const latestMin = hasData ? chartData[chartData.length - 1].preco_min : null;
  const latestMed = hasData ? chartData[chartData.length - 1].preco_medio : null;

  const setFilter = (key: keyof Filters) => (value: string) =>
    setFilters(f => ({ ...f, [key]: value }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '24px' }}>

      {/* Setup Banner */}
      {!isConfigured && (
        <div style={{
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          <div>
            <p style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              Configure as credenciais do Supabase
            </p>
            <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>
              Abra o arquivo <code style={{ color: '#a3e635', background: '#1a2235', padding: '1px 5px', borderRadius: 4 }}>dashboard-web/.env.local</code> e substitua os placeholders com sua
              {' '}<strong style={{ color: '#e2e8f0' }}>Project URL</strong> e <strong style={{ color: '#e2e8f0' }}>Anon Key</strong> do Supabase (Settings → API).
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #22d3a0, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(34,211,160,0.3)'
        }}>
          <TrendingUp size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            MTG Price Tracker
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
            Evolução de preços — his_precos_liga
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface-elevated)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 12px' }}>
          <Database size={13} color="#94a3b8" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Supabase</span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3a0', boxShadow: '0 0 6px #22d3a0' }} />
        </div>
      </div>

      {/* Filters Row */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '18px 20px', marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Filter size={14} color="#94a3b8" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Filtros</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <FilterSelect label="Carta" value={filters.carta} options={cartas} onChange={setFilter('carta')} />
          <FilterSelect label="Edição" value={filters.edicao} options={edicoes} onChange={setFilter('edicao')} disabled={!filters.carta} />
          <FilterSelect label="Ano" value={filters.ano} options={anos} onChange={setFilter('ano')} disabled={!filters.carta} />
          <FilterSelect label="Raridade" value={filters.raridade} options={raridades} onChange={setFilter('raridade')} disabled={!filters.carta} />
          <FilterSelect label="Tipo de Carta" value={filters.tipo_carta} options={tiposCarta} onChange={setFilter('tipo_carta')} disabled={!filters.carta} />
        </div>
      </div>

      {/* Stats KPIs */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Preço Mínimo Atual', value: latestMin != null ? `R$ ${latestMin.toFixed(2)}` : '—', color: '#22d3a0' },
            { label: 'Preço Médio Atual', value: latestMed != null ? `R$ ${latestMed.toFixed(2)}` : '—', color: '#a3e635' },
            { label: 'Registros', value: totalRecords.toString(), color: '#3b82f6' },
            { label: 'Período', value: `${chartData[0].data} → ${chartData[chartData.length - 1].data}`, color: '#94a3b8' },
          ].map(kpi => (
            <div key={kpi.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '16px 18px'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {kpi.label}
              </p>
              <p style={{ color: kpi.color, fontSize: 20, fontWeight: 700 }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart Card */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '24px 20px', position: 'relative', minHeight: 360
      }}>
        {/* Chart header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {filters.carta ? filters.carta : 'Selecione uma carta'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              {filters.carta
                ? [filters.edicao, filters.ano, filters.raridade, filters.tipo_carta].filter(Boolean).join(' · ') || 'Todas as variações'
                : 'Use os filtros acima para visualizar o gráfico'}
            </p>
          </div>
          {hasData && (
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { color: '#22d3a0', label: 'Preço Mínimo' },
                { color: '#a3e635', label: 'Preço Médio' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 28, height: 2, background: l.color, borderRadius: 1, display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart OR Placeholder */}
        {loading ? (
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, border: '3px solid var(--border)',
                borderTopColor: '#22d3a0', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Carregando dados...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : !hasData ? (
          <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <TrendingUp size={48} color="#1f2d45" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {filters.carta ? 'Nenhum dado encontrado para os filtros selecionados.' : 'Selecione uma carta para visualizar o gráfico de evolução de preços.'}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2d45" vertical={false} />
              <XAxis
                dataKey="data"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1f2d45' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="preco_min"
                name="Preço Mínimo"
                stroke="#22d3a0"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#22d3a0', stroke: '#0a0f1e', strokeWidth: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="preco_medio"
                name="Preço Médio"
                stroke="#a3e635"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#a3e635', stroke: '#0a0f1e', strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', color: '#2d3f5c', fontSize: 11, marginTop: 20 }}>
        MTG Price Tracker · Dados extraídos de LigaMagic · Ronin Cards
      </p>
    </div>
  );
}
