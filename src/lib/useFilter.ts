'use client';
import { create } from 'zustand';
import { trpc } from '@/server/trpc/client';
import { useEffect } from 'react';

// Define types
interface CityData {
  id: string;
  name: string;
  centroid: { lon: number; lat: number };
}

interface FilterState {
  // State
  search: string;
  province: string;
  city: string;
  date: string;
  provinces: string[];
  cities: CityData[];

  // Actions
  setSearch: (search: string) => void;
  setProvince: (province: string) => void;
  setCity: (city: string) => void;
  setDate: (date: string) => void;
  setProvinces: (provinces: string[]) => void;
  setCities: (cities: CityData[]) => void;
  resetFilters: () => void;
}

export const useFilter = create<FilterState>((set) => ({
  search: '',
  province: '',
  city: '',
  date: '',
  provinces: [],
  cities: [],

  setSearch: (search) => set({ search }),
  setProvince: (province) =>
    set((state) => ({
      province,
      city: province === '' ? '' : state.city,
    })),
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
  const { setProvinces, setCities, province } = useFilter((state) => ({
    setProvinces: state.setProvinces,
    setCities: state.setCities,
    province: state.province,
  }));

  // Load provinces
  const { data: provincesData, isSuccess: isProvincesSuccess } =
    trpc.filterEvents.getProvinces.useQuery();

  // Load cities when province changes
  const { data: citiesData, isSuccess: isCitiesSuccess } =
    trpc.filterEvents.getCitiesByState.useQuery(province, {
      enabled: province !== '',
    });

  useEffect(() => {
    if (provincesData?.states) {
      setProvinces(provincesData.states);
    }
  }, [isProvincesSuccess]);

  useEffect(() => {
    if (citiesData?.cities) {
      setCities(citiesData.cities);
    } else {
      setCities([]);
    }
  }, [isCitiesSuccess]);
}
