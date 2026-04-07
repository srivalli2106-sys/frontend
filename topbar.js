import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCity } from '../context/CityContext';

export default function Topbar({ title, subtitle }) {
  const { city, handleSearch } = useCity();
  const [input, setInput] = useState(city);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(input);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="topbar-right">
        <form onSubmit={onSubmit} style={{ display: 'flex' }}>
          <div className="city-search-bar">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter city name..."
            />
            <button type="submit" className="search-btn">
              <Search size={14} />
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
