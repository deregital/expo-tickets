'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useFilter, useLocationData } from '@/lib/useFilter';
import { useQueryState } from 'nuqs';

function FilterEvents() {
  const [searchParam, setSearchParam] = useQueryState('search');
  const [provinceParam, setProvinceParam] = useQueryState('province');
  const [cityParam, setCityParam] = useQueryState('city');
  const [dateParam, setDateParam] = useQueryState('date');

  const storeSearch = useFilter((state) => state.search);
  const storeProvince = useFilter((state) => state.province);
  const storeCity = useFilter((state) => state.city);
  const storeDate = useFilter((state) => state.date);
  const provinces = useFilter((state) => state.provinces);
  const cities = useFilter((state) => state.cities);

  const setSearch = useFilter((state) => state.setSearch);
  const setProvince = useFilter((state) => state.setProvince);
  const setCity = useFilter((state) => state.setCity);
  const setDate = useFilter((state) => state.setDate);

  const [localSearch, setLocalSearch] = useState('');
  const [localProvince, setLocalProvince] = useState('');
  const [localCity, setLocalCity] = useState('');
  const [localDate, setLocalDate] = useState('');

  useLocationData();

  const isLoadingProvinces = provinces.length === 0;
  const isLoadingCities = localProvince !== '' && cities.length === 0;

  useEffect(() => {
    setLocalSearch(searchParam || storeSearch || '');
    setLocalProvince(provinceParam || storeProvince || '');
    setLocalCity(cityParam || storeCity || '');
    setLocalDate(dateParam || storeDate || '');

    if (searchParam) setSearch(searchParam);
    if (provinceParam) setProvince(provinceParam);
    if (cityParam) setCity(cityParam);
    if (dateParam) setDate(dateParam);
  }, [
    searchParam,
    provinceParam,
    cityParam,
    dateParam,
    storeSearch,
    storeProvince,
    storeCity,
    storeDate,
    setSearch,
    setProvince,
    setCity,
    setDate,
  ]);

  function handleProvinceChange(value: string) {
    if (value === localProvince) {
      setLocalProvince('');
      setLocalCity(''); // Reset city when province is cleared
    } else {
      setLocalProvince(value);
    }
  }

  function handleCityChange(value: string) {
    if (value === localCity) {
      setLocalCity('');
    } else {
      setLocalCity(value);
    }
  }

  function handleDateChange(value: string) {
    if (value === localDate) {
      setLocalDate('');
    } else {
      setLocalDate(value);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalSearch(e.target.value);
  }

  function handleBuscar() {
    setSearch(localSearch);
    setProvince(localProvince);
    setCity(localCity);
    setDate(localDate);

    setSearchParam(localSearch || null);
    setProvinceParam(localProvince || null);
    setCityParam(localCity || null);
    setDateParam(localDate || null);

    console.log('Filtros aplicados:', {
      search: localSearch,
      province: localProvince,
      city: localCity,
      date: localDate,
    });
  }

  function getNextMonths(count: number) {
    const months = [];
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    for (let i = 0; i < count; i++) {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      const monthName = monthNames[currentMonth];
      const value = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;

      months.push({
        label: `${monthName} ${currentYear}`,
        value: value,
      });
    }

    return months;
  }
  return (
    <div className='flex items-center justify-between gap-2 p-2 bg-MiExpo_gray rounded-lg mx-[3rem] mt-[1.5rem] shadow-[0_0_15px_0_rgba(0,0,0,0.2)]'>
      <div className='w-[500px] relative'>
        <Input
          type='text'
          placeholder='Buscar evento en MiExpo'
          className='pl-3 pr-10 py-2 w-full bg-MiExpo_white'
          value={localSearch}
          onChange={handleSearch}
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
      </div>
      <div className='relative w-[300px]'>
        <Select
          disabled={isLoadingProvinces}
          value={localProvince}
          onValueChange={handleProvinceChange}
        >
          <SelectTrigger className='w-full bg-MiExpo_white'>
            <SelectValue placeholder='Provincia' />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((state: string) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {localProvince && (
          <button
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
            onClick={(e) => {
              e.stopPropagation();
              setLocalProvince('');
              setLocalCity(''); // Reset city when province is cleared
            }}
            aria-label='Limpiar selección de provincia'
          >
            ✕
          </button>
        )}
      </div>
      <div className='relative w-[300px]'>
        <Select value={localCity} onValueChange={handleCityChange}>
          <SelectTrigger
            className='w-full bg-MiExpo_white'
            disabled={!localProvince || cities.length === 0}
          >
            <SelectValue placeholder='Localidad' />
          </SelectTrigger>
          <SelectContent>
            {cities.map((cityData) => (
              <SelectItem key={cityData.id} value={cityData.name}>
                {cityData.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {localCity && (
          <button
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
            onClick={(e) => {
              e.stopPropagation();
              setLocalCity('');
            }}
            aria-label='Limpiar selección de ciudad'
          >
            ✕
          </button>
        )}
      </div>
      <div className='relative w-[300px]'>
        <Select value={localDate} onValueChange={handleDateChange}>
          <SelectTrigger className='w-full bg-MiExpo_white'>
            <SelectValue placeholder='Fecha' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='hoy'>Hoy</SelectItem>
            <SelectItem value='manana'>Mañana</SelectItem>
            <SelectItem value='esta-semana'>Esta semana</SelectItem>
            <SelectItem value='este-mes'>Este mes</SelectItem>

            {/* Próximos 6 meses */}
            {getNextMonths(6).map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {localDate && (
          <button
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
            onClick={(e) => {
              e.stopPropagation();
              setLocalDate('');
            }}
            aria-label='Limpiar selección de fecha'
          >
            ✕
          </button>
        )}
      </div>
      <Button
        className='w-[300px] bg-MiExpo_purple hover:bg-MiExpo_purple/90 text-white font-bold cursor-pointer'
        onClick={handleBuscar}
      >
        BUSCAR
      </Button>
    </div>
  );
}

export default FilterEvents;
