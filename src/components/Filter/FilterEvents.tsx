'use client';
import React, { useState } from 'react';
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
import { trpc } from '@/server/trpc/client';

function FilterEvents() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [provinceSelected, setProvinceSelected] = useState('');
  const [citySelected, setCitySelected] = useState('');

  const { data: provinces, isLoading: isLoadingProvinces } =
    trpc.filterEvents.getProvinces.useQuery();
  const { data: cities, isLoading: isLoadingCities } =
    trpc.filterEvents.getCitiesByState.useQuery(provinceSelected, {
      enabled: provinceSelected !== '',
    });

  // Función para manejar la selección de provincia
  function handleProvinceChange(value: string) {
    // Si se selecciona la misma provincia, deseleccionarla
    if (value === provinceSelected) {
      setProvinceSelected('');
    } else {
      setProvinceSelected(value);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }
  function handleBuscar() {
    console.log('Buscar');
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
          value={search}
          onChange={handleSearch}
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
      </div>
      <div className='relative w-[300px]'>
        <Select value={provinceSelected} onValueChange={handleProvinceChange}>
          <SelectTrigger className='w-full bg-MiExpo_white'>
            <SelectValue placeholder='Provincia' />
          </SelectTrigger>
          <SelectContent>
            {!isLoadingProvinces &&
              provinces?.states.map((state: string) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Select>
        <SelectTrigger
          className='w-[300px] bg-MiExpo_white'
          disabled={!cities?.cities || cities.cities.length === 0}
        >
          <SelectValue placeholder='Localidad' />
        </SelectTrigger>
        <SelectContent>
          {!isLoadingCities &&
            cities?.cities.map(
              (city: {
                id: string;
                name: string;
                centroid: { lon: number; lat: number };
              }) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ),
            )}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className='w-[300px] bg-MiExpo_white'>
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
