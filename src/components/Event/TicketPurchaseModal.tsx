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
import BuyTicketsModal from './BuyTicketsModal';
import ErrorModal from './ErrorModal';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: string;
}

function TicketPurchaseModal({
  isOpen,
  onClose,
  quantity,
}: TicketPurchaseModalProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const ticketsCount = parseInt(quantity, 10);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(''),
  });

  useEffect(() => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(''),
    });
  }, [ticketsCount]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        additionalTickets: Array(Math.max(0, ticketsCount - 1)).fill(''),
      });
    }
  }, [isOpen, ticketsCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdditionalTicketChange = (index: number, value: string) => {
    const newAdditionalTickets = [...formData.additionalTickets];
    newAdditionalTickets[index] = value;

    setFormData({
      ...formData,
      additionalTickets: newAdditionalTickets,
    });
  };

  const handleSubmit = async () => {
    onClose();
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='bg-MiExpo_white rounded-[20px] p-6 max-w-sm mx-auto max-h-[90vh]'>
          <DialogHeader className='mb-2'>
            <DialogTitle className='text-lg font-medium text-MiExpo_black'>
              Confirmación de tickets
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-6 mt-4 overflow-y-auto pr-2 max-h-[calc(90vh-100px)]'>
            <div className='rounded-[10px] border border-MiExpo_gray overflow-hidden'>
              <div className='py-2 bg-white'>
                <p className='text-sm text-center font-medium text-MiExpo_black'>
                  Nombre del titular de la entrada 1
                </p>
              </div>
              <div className='w-full h-[1px] bg-MiExpo_gray'></div>
              <Input
                name='nombre'
                value={formData.nombre}
                onChange={handleChange}
                className='w-full h-10 bg-MiExpo_white border-none rounded-none focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none px-4'
              />
            </div>
            <div className='rounded-[10px] border border-MiExpo_gray overflow-hidden'>
              <div className='py-2 bg-white'>
                <p className='text-sm text-center font-medium text-MiExpo_black'>
                  Apellido del titular de la entrada 1
                </p>
              </div>
              <div className='w-full h-[1px] bg-MiExpo_gray'></div>
              <Input
                name='apellido'
                value={formData.apellido}
                onChange={handleChange}
                className='w-full h-10 bg-MiExpo_white border-none rounded-none focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none px-4'
              />
            </div>

            <div className='rounded-[10px] border border-MiExpo_gray overflow-hidden'>
              <div className='py-2 bg-white'>
                <p className='text-sm text-center font-medium text-MiExpo_black'>
                  Mail del titular de las entradas
                </p>
              </div>
              <div className='w-full h-[1px] bg-MiExpo_gray'></div>
              <Input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full h-10 bg-MiExpo_white border-none rounded-none focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none px-4'
              />
            </div>

            {/* Tickets adicionales */}
            {ticketsCount > 1 && (
              <>
                {Array.from({ length: ticketsCount - 1 }).map((_, index) => (
                  <div
                    key={index}
                    className='rounded-[10px] border border-MiExpo_gray overflow-hidden'
                  >
                    <div className='py-2 bg-white'>
                      <p className='text-sm text-center font-medium text-MiExpo_black'>
                        Nombre y apellido del titular de la entrada {index + 2}
                      </p>
                    </div>
                    <div className='w-full h-[1px] bg-MiExpo_gray'></div>
                    <Input
                      value={formData.additionalTickets[index]}
                      onChange={(e) =>
                        handleAdditionalTicketChange(index, e.target.value)
                      }
                      className={`w-full h-10 bg-MiExpo_white border-none rounded-none focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none px-4`}
                    />
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
      <BuyTicketsModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
      <ErrorModal isOpen={showErrorModal} onClose={handleErrorModalClose} />
    </>
  );
}

export default TicketPurchaseModal;
