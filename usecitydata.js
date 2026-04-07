import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useCityData(endpoint, city, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${endpoint}?city=${encodeURIComponent(city)}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, city]);

  useEffect(() => { fetch(); }, [fetch, ...deps]);

  return { data, loading, error, refetch: fetch };
}

export function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const submitComplaint = async (data) => {
    const res = await api.post('/complaints', data);
    fetchComplaints();
    return res.data;
  };

  return { complaints, loading, fetchComplaints, submitComplaint };
}
