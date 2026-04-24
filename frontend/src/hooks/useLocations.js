import { useState, useEffect } from 'react';
import { getDistricts, getDsDivisions, getGnDivisions } from '../api';

export function useLocations(initialDistrict = '', initialDs = '') {
  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);
  const [loadingDs, setLoadingDs] = useState(false);
  const [loadingGn, setLoadingGn] = useState(false);

  useEffect(() => {
    getDistricts().then(r => setDistricts(r.data.data));
  }, []);

  const loadDs = async (districtId) => {
    if (!districtId) { setDsDivisions([]); setGnDivisions([]); return; }
    setLoadingDs(true);
    const r = await getDsDivisions(districtId);
    setDsDivisions(r.data.data);
    setGnDivisions([]);
    setLoadingDs(false);
  };

  const loadGn = async (dsId) => {
    if (!dsId) { setGnDivisions([]); return; }
    setLoadingGn(true);
    const r = await getGnDivisions(dsId);
    setGnDivisions(r.data.data);
    setLoadingGn(false);
  };

  return { districts, dsDivisions, gnDivisions, loadDs, loadGn, loadingDs, loadingGn };
}
