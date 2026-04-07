import React from 'react';
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { useCity } from '../context/CityContext';
import { useCityData } from '../hooks/useCityData';
import Topbar from '../components/Topbar';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const hours = ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'];

export default function WeatherPage() {
  const { city } = useCity();
  const { data, loading, error } = useCityData('/weather', city);

  const hourlyData = data ? hours.map((h, i) => ({
    time: h,
    temp: Math.round((data.temperature || 25) + Math.sin(i * 0.8) * 4 + (Math.random() - 0.5) * 2),
    humidity: Math.round((data.humidity || 60) + (Math.random() - 0.5) * 10),
  })) : [];

  if (loading) return (
    <>
      <Topbar title="Weather" subtitle={`Live conditions for ${city}`} />
      <div className="page-inner"><div className="loading-overlay"><div className="loading-spinner" style={{ width: 32, height: 32 }} /><span className="loading-text">Fetching weather data...</span></div></div>
    </>
  );

  if (error || !data) return (
    <>
      <Topbar title="Weather" subtitle={`Live conditions for ${city}`} />
      <div className="page-inner">
        <div className="empty-state"><Cloud /><div className="empty-state-title">No weather data</div><div className="empty-state-desc">Search for a city to see weather information.</div></div>
      </div>
    </>
  );

  const stats = [
    { icon: Thermometer, label: 'Temperature', value: `${data.temperature}°C`, color: 'var(--accent-cyan)', bg: 'rgba(0,212,255,0.1)' },
    { icon: Droplets, label: 'Humidity', value: `${data.humidity}%`, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
    { icon: Wind, label: 'Wind Speed', value: `${data.windSpeed} km/h`, color: 'var(--accent-teal)', bg: 'rgba(20,184,166,0.1)' },
    { icon: Cloud, label: 'Condition', value: data.condition, color: 'var(--accent-purple)', bg: 'rgba(168,85,247,0.1)' },
  ];

  return (
    <>
      <Topbar title="Weather" subtitle={`Live conditions for ${city}`} />
      <div className="page-inner">
        <div className="stat-grid fade-in">
          {stats.map(s => (
            <div className="stat-card" key={s.label} style={{ '--accent-color': s.color, '--icon-bg': s.bg }}>
              <div className="stat-icon"><s.icon /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: s.label === 'Condition' ? 18 : 28 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="data-grid fade-in fade-in-1">
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Thermometer />Temperature Throughout Day</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Area type="monotone" dataKey="temp" stroke="var(--accent-cyan)" strokeWidth={2} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><Droplets />Humidity Variation</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
                <Line type="monotone" dataKey="humidity" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card fade-in fade-in-2">
          <div className="card-header">
            <div className="card-title"><Eye />Detailed Forecast — {city}</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Time</th><th>Temperature</th><th>Humidity</th><th>Condition</th></tr>
            </thead>
            <tbody>
              {hourlyData.map((row, i) => (
                <tr key={i}>
                  <td>{row.time}</td>
                  <td style={{ color: 'var(--accent-cyan)' }}>{row.temp}°C</td>
                  <td>{row.humidity}%</td>
                  <td><span className="badge badge-info">{data.condition}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
