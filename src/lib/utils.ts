import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventDate(dateString: string) {
  const date = new Date(dateString);

  // Obtener el día (número)
  const day = date.getDate().toString().padStart(2, '0');

  // Obtener el día de la semana (abreviado en español)
  const dayOfWeekNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayOfWeek = dayOfWeekNames[date.getDay()];

  // Obtener el mes (abreviado en español)
  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  const month = monthNames[date.getMonth()];

  // Obtener el año
  const year = date.getFullYear().toString();

  // Obtener la hora (formato 24h)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return { day, month, year, time, dayOfWeek };
}
