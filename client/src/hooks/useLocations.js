import { useState, useEffect } from "react";
import locationService from "../services/locationService";

export const useLocations = (cityCode, districtCode) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setProvinces(await locationService.getAllProvinces()); } catch { } finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (cityCode) locationService.getDistrictsByProvince(cityCode).then(d => setDistricts(d || []));
    else { setDistricts([]); setWards([]); }
  }, [cityCode]);

  useEffect(() => {
    if (districtCode) locationService.getWardsByDistrict(districtCode).then(w => setWards(w || []));
    else setWards([]);
  }, [districtCode]);

  return { provinces, districts, wards, loading };
};
