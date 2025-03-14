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
import { useFilter } from '@/lib/useFilter';
import { useQueryState } from 'nuqs';
import { trpc } from '@/server/trpc/client';

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

  const setSearch = useFilter((state) => state.setSearch);
  const setProvince = useFilter((state) => state.setProvince);
  const setCity = useFilter((state) => state.setCity);
  const setDate = useFilter((state) => state.setDate);
  const setProvinces = useFilter((state) => state.setProvinces);

  const [localSearch, setLocalSearch] = useState('');
  const [localProvince, setLocalProvince] = useState('');
  const [localCity, setLocalCity] = useState('');
  const [localDate, setLocalDate] = useState('');
  const [localCities, setLocalCities] = useState<
    { id: string; name: string; centroid: { lon: number; lat: number } }[]
  >([]);

  // Load provinces
  const { data: provincesData } = trpc.filterEvents.getProvinces.useQuery();

  // Load cities when local province changes
  const { data: citiesData, isLoading: isLoadingCitiesData } =
    trpc.filterEvents.getCitiesByState.useQuery(localProvince, {
      enabled: localProvince !== '',
    });

  const isLoadingProvinces = provinces.length === 0;
  const isLoadingCities = localProvince !== '' && isLoadingCitiesData;

  useEffect(() => {
    if (provincesData?.states) {
      setProvinces(provincesData.states);
    }
  }, [provincesData, setProvinces]);

  useEffect(() => {
    if (citiesData?.cities) {
      setLocalCities(citiesData.cities);
    } else {
      setLocalCities([]);
    }
  }, [citiesData]);

  useEffect(() => {
    setLocalSearch(searchParam || storeSearch || '');
    setLocalProvince(provinceParam || storeProvince || '');
    setLocalCity(cityParam || storeCity || '');
    setLocalDate(dateParam || storeDate || '');
  }, [
    searchParam,
    provinceParam,
    cityParam,
    dateParam,
    storeSearch,
    storeProvince,
    storeCity,
    storeDate,
  ]);

  function handleProvinceChange(value: string) {
    if (value === localProvince) {
      setLocalProvince('');
      setLocalCity(''); // Reset city when province is cleared
    } else {
      setLocalProvince(value);
      setLocalCity(''); // Reset city when province changes
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
    // Update global state
    setSearch(localSearch);
    setProvince(localProvince);
    setCity(localCity);
    setDate(localDate);

    // Update URL params
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
    <div
      className='bg-MiExpo_gray rounded-[5px] md:rounded-lg p-1 md:p-2 font-sans 
                    shadow-[0_0_7.5px_0_rgba(0,0,0,0.2)] md:shadow-[0_0_15px_0_rgba(0,0,0,0.2)] 
                    mx-5 mt-5 md:mx-[3rem] md:mt-[1.5rem]
                    flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 md:gap-2'
    >
      {/* Versión móvil: Primera fila (Search y fecha) */}
      <div className='flex flex-row gap-1 lg:hidden w-full'>
        <div className='relative flex-1'>
          <Input
            type='text'
            placeholder='Buscar evento en MiExpo'
            className='pl-3 pr-10 py-2 w-full bg-MiExpo_white'
            value={localSearch}
            onChange={handleSearch}
          />
          <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        </div>
        <div className='relative flex-1'>
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
      </div>

      {/* Versión móvil: Segunda fila (provincia, localidad y buscar) */}
      <div className='flex flex-row gap-1 lg:hidden w-full'>
        <div className='relative flex-1'>
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
                setLocalCity('');
              }}
              aria-label='Limpiar selección de provincia'
            >
              ✕
            </button>
          )}
        </div>
        <div className='relative flex-1'>
          <Select value={localCity} onValueChange={handleCityChange}>
            <SelectTrigger
              className='w-full bg-MiExpo_white'
              disabled={!localProvince || isLoadingCities}
            >
              <SelectValue placeholder='Localidad' />
            </SelectTrigger>
            <SelectContent>
              {localCities.map((cityData) => (
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
        <Button
          className='flex-1 bg-MiExpo_purple hover:bg-MiExpo_purple/90 text-white font-bold cursor-pointer'
          onClick={handleBuscar}
        >
          BUSCAR
        </Button>
      </div>

      <div className='hidden lg:block lg:w-[500px] relative'>
        <Input
          type='text'
          placeholder='Buscar evento en MiExpo'
          className='pl-3 pr-10 py-2 w-full bg-MiExpo_white'
          value={localSearch}
          onChange={handleSearch}
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
      </div>
      <div className='hidden lg:block relative lg:w-[300px]'>
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
      <div className='hidden lg:block relative lg:w-[300px]'>
        <Select value={localCity} onValueChange={handleCityChange}>
          <SelectTrigger
            className='w-full bg-MiExpo_white'
            disabled={!localProvince || isLoadingCities}
          >
            <SelectValue placeholder='Localidad' />
          </SelectTrigger>
          <SelectContent>
            {localCities.map((cityData) => (
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
      <div className='hidden lg:block relative lg:w-[300px]'>
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
        className='hidden lg:block lg:w-[300px] bg-MiExpo_purple hover:bg-MiExpo_purple/90 text-white font-bold cursor-pointer'
        onClick={handleBuscar}
      >
        BUSCAR
      </Button>
    </div>
  );
}

export default FilterEvents;
