import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Wind, Car, Newspaper, Bell, BarChart3, Map, MessageSquare, Building2, ArrowRight, Thermometer, Droplets, Eye, AlertTriangle } from 'lucide-react';
import { useCity } from '../context/CityContext';
import { useCityData } from '../hooks/useCityData';
import Topbar from '../components/Topbar';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
        <span style={{ color: 'var(--accent-cyan)' }}>{payload[0]?.value}</span>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { city } = useCity();
  const { data: weather, loading: wl } = useCityData('/weather', city);
  const { data: aqi, loading: al } = useCityData('/aqi', city);
  const { data: alerts } = useCityData('/alerts', city);

  const tempData = weather ? Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    temp: Math.round((weather.temperature || 25) + (Math.random() - 0.5) * 6),
  })) : [];

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'var(--accent-green)';
    if (aqi <= 100) return 'var(--accent-amber)';
    if (aqi <= 150) return 'var(--accent-amber)';
    return 'var(--accent-red)';
  };

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    return 'Unhealthy';
  };

  const quickLinks = [
    { to: '/weather', icon: Cloud, label: 'Weather', color: 'var(--accent-cyan)' },
    { to: '/aqi', icon: Wind, label: 'Air Quality', color: 'var(--accent-teal)' },
    { to: '/traffic', icon: Car, label: 'Traffic', color: 'var(--accent-amber)' },
    { to: '/news', icon: Newspaper, label: 'News', color: 'var(--accent-blue)' },
    { to: '/alerts', icon: Bell, label: 'Alerts', color: 'var(--accent-red)' },
    { to: '/city-info', icon: Building2, label: 'City Info', color: 'var(--accent-purple)' },
    { to: '/map', icon: Map, label: 'Map', color: 'var(--accent-green)' },
    { to: '/complaints', icon: MessageSquare, label: 'Complaints', color: 'var(--accent-cyan)' },
  ];

  return (
    <>
      <Topbar title={`${city} Dashboard`} subtitle="Smart city intelligence at a glance" />
      <div className="page-inner">
        {/* Stats row */}
        <div className="stat-grid fade-in">
          <div className="stat-card" style={{ '--accent-color': 'var(--accent-cyan)', '--icon-bg': 'rgba(0,212,255,0.1)' }}>
            <div className="stat-icon"><Thermometer /></div>
            <div className="stat-label">Temperature</div>
            <div className="stat-value">{wl ? '—' : `${weather?.temperature ?? '—'}°`}</div>
            <div className="stat-unit">{weather?.condition || 'Loading...'}</div>
          </div>
          <div className="stat-card" style={{ '--accent-color': 'var(--accent-teal)', '--icon-bg': 'rgba(20,184,166,0.1)' }}>
            <div className="stat-icon"><Droplets /></div>
            <div className="stat-label">Humidity</div>
            <div className="stat-value">{wl ? '—' : `${weather?.humidity ?? '—'}%`}</div>
            <div className="stat-unit">Relative humidity</div>
          </div>
          <div className="stat-card" style={{ '--accent-color': aqi ? getAQIColor(aqi.aqi) : 'var(--accent-green)', '--icon-bg': 'rgba(34,197,94,0.1)' }}>
            <div className="stat-icon"><Wind /></div>
            <div className="stat-label">Air Quality Index</div>
            <div className="stat-value">{al ? '—' : (aqi?.aqi ?? '—')}</div>
            <div className="stat-unit">{aqi ? getAQILabel(aqi.aqi) : 'Loading...'}</div>
          </div>
          <div className="stat-card" style={{ '--accent-color': 'var(--accent-red)', '--icon-bg': 'rgba(239,68,68,0.1)' }}>
            <div className="stat-icon"><AlertTriangle /></div>
            <div className="stat-label">Active Alerts</div>
            <div className="stat-value">{alerts?.alerts?.length ?? '—'}</div>
            <div className="stat-unit">City-wide alerts</div>
          </div>
        </div>

        {/* Charts + Quick links */}
        <div className="data-grid fade-in fade-in-1">
          {/* Temperature trend */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><BarChart3 />Weekly Temperature Trend</div>
              <Link to="/weather" className="btn btn-secondary btn-sm">View <ArrowRight size={12} /></Link>
            </div>
            {tempData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={tempData}>
                  <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="temp" stroke="var(--accent-cyan)" strokeWidth={2} dot={{ fill: 'var(--accent-cyan)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="loading-overlay" style={{ minHeight: 200 }}>
                <div className="loading-spinner" /><span className="loading-text">Loading data...</span>
              </div>
            )}
          </div>

          {/* Quick navigation */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Map />Quick Access</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                  color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <link.icon size={15} style={{ color: link.color, flexShrink: 0 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wind speed + condition */}
        {weather && (
          <div className="card fade-in fade-in-2">
            <div className="card-header">
              <div className="card-title"><Eye />Weather Conditions — {city}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { label: 'Wind Speed', value: `${weather.windSpeed} km/h`, color: 'var(--accent-blue)' },
                { label: 'Condition', value: weather.condition, color: 'var(--accent-cyan)' },
                { label: 'Feels Like', value: `${Math.round((weather.temperature || 0) - 2)}°C`, color: 'var(--accent-teal)' },
                { label: 'Visibility', value: 'Good', color: 'var(--accent-green)' },
              ].map(item => (
                <div key={item.label} style={{ padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: item.color, fontFamily: 'var(--font-display)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
