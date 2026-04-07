import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [city, setCity] = useState('Delhi');
  const [searchCity, setSearchCity] = useState('Delhi');

  const handleSearch = (newCity) => {
    if (newCity.trim()) {
      setCity(newCity.trim());
      setSearchCity(newCity.trim());
    }
  };

  return (
    <CityContext.Provider value={{ city, searchCity, setCity, handleSearch }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be inside CityProvider');
  return ctx;
};
