import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Cloud, Wind, Car, Newspaper, Bell,
  Building2, Map, MessageSquare, BarChart3, CreditCard,
  LogOut, Search, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

const navItems = [
  { label: 'Overview', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/map', icon: Map, label: 'City Map' },
  ]},
  { label: 'City Data', items: [
    { to: '/weather', icon: Cloud, label: 'Weather' },
    { to: '/aqi', icon: Wind, label: 'Air Quality' },
    { to: '/traffic', icon: Car, label: 'Traffic' },
    { to: '/city-info', icon: Building2, label: 'City Info' },
  ]},
  { label: 'Live', items: [
    { to: '/news', icon: Newspaper, label: 'News' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ]},
  { label: 'Services', items: [
    { to: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/payment', icon: CreditCard, label: 'Premium Report' },
  ]},
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { city, handleSearch } = useCity();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(city);

  const onSearch = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <NavLink to="/dashboard" className="sidebar-logo-mark">
            <div className="logo-icon">
              <Zap size={16} color="white" />
            </div>
            <span>Digital<br />Twin City</span>
          </NavLink>
        </div>

        <div className="sidebar-search">
          <form onSubmit={onSearch}>
            <div className="search-input-wrap">
              <Search />
              <input
                className="search-input"
                placeholder="Search city..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
          </form>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(section => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill" onClick={logout} title="Click to logout">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">Click to logout</div>
            </div>
            <LogOut size={14} color="var(--text-muted)" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
