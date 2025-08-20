import { useState, useEffect } from 'react';
import api from '../services/api';

export function useFeaturedListings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/listings/featured');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

export function useSearchListings(params) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const search = async () => {
      try {
        setLoading(true);
        const response = await api.get('/listings', { params });
        setResults(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(params).length > 0) {
      search();
    }
  }, [params]);

  return { results, loading, error };
}