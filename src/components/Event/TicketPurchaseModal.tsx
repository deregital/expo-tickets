'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketName: string;
  quantity: string;
  price: number;
}

function TicketPurchaseModal({
  isOpen,
  onClose,
  ticketName,
  quantity,
  price,
}: TicketPurchaseModalProps) {
  // Crear un array de tickets basado en la cantidad
  const ticketsCount = parseInt(quantity, 10);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    // Agregar campos adicionales para tickets adicionales
    additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(''),
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    nombre: false,
    apellido: false,
    email: false,
    additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(false),
  });

  // Resetear el estado cuando cambia la cantidad de tickets
  useEffect(() => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(''),
    });

    setErrors({
      nombre: false,
      apellido: false,
      email: false,
      additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(false),
    });
  }, [ticketsCount]);

  // Manejar cambios en los campos principales
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error cuando el usuario comienza a escribir
    if (e.target.value) {
      setErrors({
        ...errors,
        [e.target.name]: false,
      });
    }
  };

  // Manejar cambios en los tickets adicionales
  const handleAdditionalTicketChange = (index: number, value: string) => {
    const newAdditionalTickets = [...formData.additionalTickets];
    newAdditionalTickets[index] = value;

    setFormData({
      ...formData,
      additionalTickets: newAdditionalTickets,
    });

    // Limpiar error cuando el usuario comienza a escribir
    if (value) {
      const newErrors = { ...errors };
      newErrors.additionalTickets[index] = false;
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    // Validar campos principales
    const newErrors = {
      nombre: !formData.nombre,
      apellido: !formData.apellido,
      email: !formData.email,
      additionalTickets: formData.additionalTickets.map((ticket) => !ticket),
    };

    setErrors(newErrors);

    // Verificar si hay errores
    const hasMainErrors =
      newErrors.nombre || newErrors.apellido || newErrors.email;
    const hasAdditionalErrors = newErrors.additionalTickets.some(
      (error) => error,
    );

    // Si no hay errores, proceder
    if (!hasMainErrors && !hasAdditionalErrors) {
      console.log('Datos del formulario:', formData);
      console.log(`Compra confirmada: ${quantity} tickets de ${ticketName}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white rounded-[20px] p-6 max-w-md mx-auto'>
        <DialogHeader className='mb-2'>
          <DialogTitle className='text-lg font-medium text-MiExpo_black'>
            Confirmación de tickets
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 mt-4'>
          <div>
            <Input
              name='nombre'
              placeholder='Nombre del titular de la entrada 1'
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full h-12 bg-white border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-[10px] px-4`}
            />
            {errors.nombre && (
              <p className='text-red-500 text-xs mt-1'>
                Este campo es obligatorio
              </p>
            )}
          </div>

          <div>
            <Input
              name='apellido'
              placeholder='Apellido del titular de la entrada 1'
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full h-12 bg-white border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} rounded-[10px] px-4`}
            />
            {errors.apellido && (
              <p className='text-red-500 text-xs mt-1'>
                Este campo es obligatorio
              </p>
            )}
          </div>

          <div>
            <Input
              name='email'
              type='email'
              placeholder='Mail del titular de las entradas'
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[10px] px-4`}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>
                Este campo es obligatorio
              </p>
            )}
          </div>

          {/* Tickets adicionales */}
          {ticketsCount > 1 && (
            <>
              {Array.from({ length: ticketsCount - 1 }).map((_, index) => (
                <div key={index}>
                  <Input
                    placeholder={`Nombre del titular de la entrada ${index + 2}`}
                    value={formData.additionalTickets[index]}
                    onChange={(e) =>
                      handleAdditionalTicketChange(index, e.target.value)
                    }
                    className={`w-full h-12 bg-white border ${errors.additionalTickets[index] ? 'border-red-500' : 'border-gray-300'} rounded-[10px] px-4`}
                  />
                  {errors.additionalTickets[index] && (
                    <p className='text-red-500 text-xs mt-1'>
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          <div className='mt-6'>
            <Button
              onClick={handleSubmit}
              className='w-full bg-MiExpo_purple hover:bg-MiExpo_purple/90 text-MiExpo_white py-3 rounded-[10px] font-medium uppercase'
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TicketPurchaseModal;
