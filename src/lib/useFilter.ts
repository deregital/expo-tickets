import { trpc } from '@/server/trpc/client';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { create } from 'zustand';

// Define types
interface CityData {
  id: string;
  name: string;
  centroid: { lon: number; lat: number };
}

interface FilterState {
  // State
  search: string | null;
  province: string | null;
  city: string | null;
  date: string | null;
  provinces: string[];
  cities: CityData[];

  // Actions
  setSearch: (search: string | null) => void;
  setProvince: (province: string | null) => void;
  setCity: (city: string | null) => void;
  setDate: (date: string | null) => void;
  setProvinces: (provinces: string[]) => void;
  setCities: (cities: CityData[]) => void;
  resetFilters: () => void;
}

export function useParamsFilter(): FilterState {
  const [search, setSearch] = useQueryState('search');
  const [province, setProvince] = useQueryState('province');
  const [city, setCity] = useQueryState('city');
  const [date, setDate] = useQueryState('date');
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);

  function resetFilters() {
    setSearch(null);
    setProvince(null);
    setCity(null);
    setDate(null);
  }

  return {
    search,
    province,
    city,
    date,
    setSearch,
    setProvince,
    setCity,
    setDate,
    provinces,
    cities,
    setProvinces,
    setCities,
    resetFilters,
  };
}

export const useLocalFilter = create<FilterState>((set) => ({
  search: '',
  province: '',
  city: '',
  date: '',
  provinces: [],
  cities: [],

  setSearch: (search) => set({ search }),
  setProvince: (province) => set({ province }),
  setCity: (city) => set({ city }),
  setDate: (date) => set({ date }),
  setProvinces: (provinces) => set({ provinces }),
  setCities: (cities) => set({ cities }),
  resetFilters: () =>
    set({
      search: '',
      province: '',
      city: '',
      date: '',
    }),
}));

export function useLocationData() {
  const { setProvinces, setCities, province } = useParamsFilter();

  // Load provinces
  const { data: provincesData, isSuccess: isProvincesSuccess } =
    trpc.filterEvents.getProvinces.useQuery();

  // Load cities when province changes
  const { data: citiesData, isSuccess: isCitiesSuccess } =
    trpc.filterEvents.getCitiesByState.useQuery(province!, {
      enabled: province !== null,
    });

  useEffect(() => {
    if (provincesData?.states) {
      setProvinces(provincesData.states);
    }
  }, [isProvincesSuccess, provincesData?.states, setProvinces]);

  useEffect(() => {
    if (citiesData?.cities) {
      setCities(citiesData.cities);
    } else {
      setCities([]);
    }
  }, [citiesData?.cities, isCitiesSuccess, setCities]);
}
