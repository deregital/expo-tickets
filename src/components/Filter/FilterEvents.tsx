'use client';
import React, { useEffect } from 'react';
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
import { useLocalFilter, useParamsFilter } from '@/lib/useFilter';
import { useShallow } from 'zustand/react/shallow';
import { trpc } from '@/server/trpc/client';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

function FilterEvents() {
  const {
    date,
    search,
    city,
    province,
    setSearch,
    setProvince,
    setCity,
    setDate,
  } = useParamsFilter();

  const {
    province: localProvince,
    city: localCity,
    setCity: setLocalCity,
    cities: localCities,
    setCities: setLocalCities,
    search: localSearch,
    date: localDate,
    setSearch: setLocalSearch,
    setProvince: setLocalProvince,
    setDate: setLocalDate,
    provinces: localProvinces,
    setProvinces: setLocalProvinces,
  } = useLocalFilter(
    useShallow((state) => ({
      cities: state.cities,
      search: state.search,
      province: state.province,
      city: state.city,
      date: state.date,
      provinces: state.provinces,
      setCities: state.setCities,
      setSearch: state.setSearch,
      setProvince: state.setProvince,
      setCity: state.setCity,
      setDate: state.setDate,
      setProvinces: state.setProvinces,
    })),
  );

  useEffect(() => {
    setLocalProvince(province);
    setLocalCity(city);
    setLocalSearch(search);
    setLocalDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, date, province, search]);

  // Load provinces
  const { data: provincesData, isLoading: isLoadingProvinces } =
    trpc.filterEvents.getProvinces.useQuery();

  // Load cities when local province changes
  const { data: citiesData, isLoading: isLoadingCitiesData } =
    trpc.filterEvents.getCitiesByState.useQuery(localProvince!, {
      enabled: localProvince !== null && localProvince !== '',
    });

  const isLoadingCities = localProvince !== '' && isLoadingCitiesData;

  useEffect(() => {
    if (provincesData?.states) {
      setLocalProvinces(provincesData.states);
    }
  }, [provincesData, setLocalProvinces]);

  useEffect(() => {
    if (citiesData?.cities) {
      setLocalCities(citiesData.cities);
    } else {
      setLocalCities([]);
    }
  }, [citiesData, setLocalCities]);

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
    setSearch(localSearch || null);
    setProvince(localProvince || null);
    setCity(localCity || null);
    setDate(localDate || null);
  }

  function getNextMonths(count: number) {
    const months = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const nextMonth = addMonths(today, i + 1);
      const monthName = format(nextMonth, 'MMMM yyyy', { locale: es });
      const value = format(nextMonth, 'yyyy-MM');

      months.push({
        label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
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
                    lg:flex grid grid-rows-2 grid-cols-3 lg:flex-row lg:items-center lg:justify-between gap-1 md:gap-2'
    >
      <div className='col-span-2 lg:block lg:w-[500px] relative'>
        <Input
          type='text'
          placeholder='Buscar evento en MiExpo'
          className='pl-3 pr-10 py-2 w-full bg-MiExpo_white'
          value={localSearch ?? ''}
          onChange={handleSearch}
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
      </div>
      <div className='col-span-1 row-start-2 lg:block relative lg:w-[300px]'>
        <Select
          value={localProvince ?? ''}
          disabled={isLoadingProvinces}
          onValueChange={handleProvinceChange}
        >
          <SelectTrigger className='w-full bg-MiExpo_white'>
            <SelectValue placeholder='Provincia' />
          </SelectTrigger>
          <SelectContent>
            {localProvinces.map((state: string) => (
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
      <div className='col-start-2 row-start-2 col-span-1 lg:block relative lg:w-[300px]'>
        <Select value={localCity ?? ''} onValueChange={handleCityChange}>
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
      <div className='row-start-1 col-start-3 col-span-1 lg:block relative lg:w-[300px]'>
        <Select value={localDate ?? ''} onValueChange={handleDateChange}>
          <SelectTrigger className='w-full bg-MiExpo_white'>
            <SelectValue placeholder='Fecha' />
          </SelectTrigger>
          <SelectContent side='bottom' align='end'>
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
        onClick={handleBuscar}
        className='col-span-1 col-start-3 row-start-2 lg:block lg:w-[300px] bg-MiExpo_purple hover:bg-MiExpo_purple/90 text-white font-bold cursor-pointer'
      >
        BUSCAR
      </Button>
    </div>
  );
}

export default FilterEvents;
